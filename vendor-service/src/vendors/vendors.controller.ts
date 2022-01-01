import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { firstValueFrom } from 'rxjs';
import { FilesService } from '../files/files.service';
import { MessagingService } from '../messaging/messaging.service';
import { VendorCreationDto } from './dtos/vendorCreationDto';
import { GetVendorInfoResponse } from './interfaces/getVendorInfoResponse.interface';
import { GetVendorInfoRequest } from './interfaces/getVendorInfoRequest.interface';
import { VendorsService } from './vendors.service';
import { VendorForUpdateDto } from './dtos/vendorForUpdateDto';
import { GetVendorsByConditionsDto } from './dtos/getVendorsByConditionDto';
import { Vendor } from './models/vendor.model';
import { CatalogService } from '../catalog/catalog.service';
import { Category } from '../catalog/interfaces/category.interface';

@Controller('vendors')
export class VendorsController {
  constructor(
    private readonly _vendorsService: VendorsService,
    private readonly _messagingService: MessagingService,
    private readonly _filesService: FilesService,
    private readonly _catalogService: CatalogService,
  ) {}

  @Get()
  async getByConditions(@Query() dto: GetVendorsByConditionsDto) {
    let result = { data: new Array(), pagination: { total: 0 } };

    if (!dto?.ownerId)
      result = await this._vendorsService.getAll(dto.limit, dto.offset);
    else {
      result = await this._vendorsService.getByOwner(
        dto.ownerId,
        dto.limit,
        dto.offset,
      );
      if (!result.data.length) throw new NotFoundException();
    }

    result.data = await this.getVendorsWithLogoUrl(result.data);
    return result;
  }

  @Get(':id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const vendor = await this._vendorsService.getById(id);
    if (!vendor) throw new NotFoundException();

    // get logo from storage service through gRPC
    const logoUrl = await this.getLogoUrl(vendor.id);

    // get categories for vendor through gRPC
    const categories = await this.getCategoryList(vendor.id);

    return {
      ...vendor.toJSON(),
      logoUrl,
      categories,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async register(
    @Body() dto: VendorCreationDto,
    @UploadedFile() logoImage?: Express.Multer.File,
  ) {
    // if vendor email or name has already existed return bad request
    const vendors = await this._vendorsService.find(
      dto.name,
      dto.email,
      dto.hotline,
    );
    if (vendors.length) throw new BadRequestException();

    const vendor = await this._vendorsService.register(dto);

    // if logo was uploaded then send to file service
    // to upload image to s3
    if (!!logoImage) {
      await this._messagingService.uploadImages(vendor.id, [logoImage]);
    }

    return vendor;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: VendorForUpdateDto) {
    var vendor = await this._vendorsService.getById(id);
    if (!vendor) return new NotFoundException();

    if (updateDto.active) {
      const [_, vendors] = await this._vendorsService.activate(id);
      vendor = vendors[0];
    }

    return vendor;
  }

  @GrpcMethod('VendorsService')
  async getNameAndLogoUrl(
    request: GetVendorInfoRequest,
  ): Promise<GetVendorInfoResponse> {
    const vendor = await this._vendorsService.getById(request.id);
    if (!vendor) return { id: request.id, name: '', logoUrl: '', slug: '' };

    // get logo from storage service through gRPC
    const logoUrl = await this.getLogoUrl(vendor.id);

    return {
      id: vendor.id,
      name: vendor.name,
      slug: vendor.slug,
      logoUrl,
    };
  }

  private async getVendorsWithLogoUrl(vendors: Array<Vendor>) {
    // get logo from storage service through gRPC
    const vendorsWithLogo = await Promise.all(
      vendors.map(async (vendor) => {
        if (!vendor) return vendor;
        const logoUrl = await this.getLogoUrl(vendor.id);
        return {
          ...vendor.toJSON(),
          logoUrl,
        };
      }),
    );

    return vendorsWithLogo;
  }

  private async getLogoUrl(id: string): Promise<string> {
    const response = await firstValueFrom(
      this._filesService.getAllForOwner({ ownerId: id }),
    );

    return response?.files ? response.files[0].url : '';
  }

  private async getCategoryList(id: string): Promise<Array<Category>> {
    const response = await firstValueFrom(
      this._catalogService.getCategoryListForVendor({ vendorId: id }),
    );

    return response.categories || [];
  }
}
