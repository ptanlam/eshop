import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { firstValueFrom, map, tap } from 'rxjs';
import { ProductsModule } from 'src/products/products.module';
import { CreateDiscountDto } from '../dtos/create-discount.dto';
import { FilesService } from '../files/files.service';
import { MessagingService } from '../messaging/messaging.service';
import { ProductsService } from '../products/products.service';
import { DiscountsService } from './discounts.service';
import { ReturnProductsDiscountsResponse } from './interfaces/response';
import { ReturnProductsDiscountsRequest } from './interfaces/resquest';

@Controller('discounts')
export class DiscountsController {
  constructor(
    private readonly discountsService: DiscountsService,
    private readonly productsService: ProductsService,
    private readonly filesService: FilesService,
    private readonly messagingService: MessagingService,
  ) {}

  @GrpcMethod('DiscountsService')
  async returnProductsDiscounts(
    data: ReturnProductsDiscountsRequest,
  ): Promise<ReturnProductsDiscountsResponse> {
    const response = this.discountsService.returnProductsDiscounts(data);
    return response;
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  async create(
    @Body() createDiscountDto: CreateDiscountDto,
    @UploadedFiles()
    files: {
      files?: Express.Multer.File[];
    },
  ) {
    const {
      vendorId,
      discountName,
      description,
      priority,
      allowedUses,
      modifier,
      discountRule,
      unit,
      startDate,
      endDate,
      isFlatAmount,
      productId,
    } = createDiscountDto;
    const temp = new CreateDiscountDto(
      vendorId,
      discountName,
      description,
      priority,
      allowedUses,
      modifier,
      discountRule,
      unit,
      startDate,
      endDate,
      isFlatAmount,
      productId,
    );
    const res = JSON.parse(
      JSON.stringify(await this.discountsService.createDiscount(temp)),
    );
    const products = await this.productsService.addProductToDiscount(
      productId,
      res.id,
    );
    res.products = products;
    this.messagingService.saveFiles(res.id, files.files);
    return res;
  }

  @Post('/:id/product-collection')
  async addProductToDiscount(
    @Param('id') id: string,
    @Body() productIds: string[],
  ) {
    await this.productsService.addProductToDiscount(productIds, id);
  }

  @Get('/:id/vendors/')
  async findDiscountByVendorId(@Param('id') id: string) {
    return this.discountsService.findDiscountByVendorId(id);
  }

  @Get(':id')
  async finDiscountById(@Param('id') id: string) {
    const discount = JSON.parse(
      JSON.stringify(await this.discountsService.findDiscountById(id)),
    );

    const products = await Promise.all(
      discount.products.map(async (p) => {
        return firstValueFrom(
          this.productsService.getProductById({ id: p.id }),
        );
      }),
    );
    discount.products = products;
    return discount;
  }
}
