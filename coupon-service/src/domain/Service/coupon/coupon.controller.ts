import { UploadFilesForOwnerResponse } from './../../../interfaces/Files/uploadFilesForOwnerResponse.interface';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { timeout, firstValueFrom } from 'rxjs';
import { defaultCurrency } from 'src/constants';

import { FixedTotalPriceDto } from '../../../domain/dtos/FixedTotalPrice.dto';
import { UpdateCouponDto } from '../../../domain/dtos/UpdateCoupon.dto';
import {
  CouponFilter,
  CouponFilterResponse,
} from '../../../interfaces/Coupon/getCouponForClient';
import { GetAllForOwnerResponse } from '../../../interfaces/Files';
import { MessagingService } from '../../../messaging/messaging.service';
import { ExceptionFilter } from '../../../utils/rpc-exception.filter';
import { CouponDto, CouponType, ManyCouponDto } from '../../dtos/Coupon.dto';
import { PointUserService } from '../accumulatePoint/pointUser.service';
import { ExchangeService } from '../exchange_rates/exchange_rates.service';
import { FilesService } from '../files/files.service';
import { CouponService } from './coupon.service';

@Controller('coupons')
export class CouponController {
  private readonly logger = new Logger('CouponController');

  constructor(
    private readonly couponService: CouponService,
    private readonly pointUserService: PointUserService,
    private readonly fileService: FilesService,
    private readonly messagingService: MessagingService,
    private readonly exchangeService: ExchangeService,
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  public async addCoupon(
    @Body() couponDto: CouponDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ): Promise<CouponFilter> {
    try {
      if (Object.values(CouponType)?.includes(couponDto.couponType)) {
        // if (String(couponDto.isUnlimited).toLocaleLowerCase() == 'true') {
        if (couponDto.isUnlimited == 'true') {
          if (couponDto.couponType == 'percentage') {
            couponDto.limit = 0;
            couponDto.amount = 0;
            const coupon = await this.couponService.addCoupon({ ...couponDto });
            await this.uploadImages(Object.values(coupon)[0].id, files.files);
            await Promise.all(
              coupon.map(async (item) => {
                const { files } = await this.getImages(item.id);
                item.images = files;
                return item.images, item.unit, item.images;
              }),
            );
            return coupon[0];
          } else if (couponDto.couponType == 'cash') {
            couponDto.limit = 0;
            couponDto.modifier = 0;
            const price = await this.getPrice(
              couponDto.unit,
              defaultCurrency,
              couponDto.amount,
            );
            couponDto.unit = price.unit;
            couponDto.amount = price.amount;
            const coupon = await this.couponService.addCoupon({
              ...couponDto,
            });
            // await this.messagingService.saveFiles(coupon.id, files.files);
            await this.uploadImages(Object.values(coupon)[0].id, files.files);
            await Promise.all(
              coupon.map(async (item) => {
                const { files } = await this.getImages(item.id);
                item.images = files;
                return item.images, item.unit, item.images;
              }),
            );
            return coupon[0];
          }
          // } else if (Object.values(couponDto.isUnlimited).indexOf(false)) {
          // } else if (
          //   String(couponDto.isUnlimited).toLocaleLowerCase() == 'false'
          // ) {
        } else if (couponDto.isUnlimited == 'false') {
          if (couponDto.couponType == 'percentage') {
            couponDto.amount = 0;
            const coupon = await this.couponService.addCoupon({
              ...couponDto,
            });
            await this.uploadImages(Object.values(coupon)[0].id, files.files);
            await Promise.all(
              coupon.map(async (item) => {
                const { files } = await this.getImages(item.id);
                item.images = files;
                return item.images, item.unit, item.images;
              }),
            );
            return coupon[0];
          } else if (couponDto.couponType == 'cash') {
            couponDto.modifier = 0;
            const price = await this.getPrice(
              couponDto.unit,
              defaultCurrency,
              couponDto.amount,
            );
            couponDto.unit = price.unit;
            couponDto.amount = price.amount;
            const coupon = await this.couponService.addCoupon({
              ...couponDto,
            });
            // await this.messagingService.saveFiles(coupon.id, files.files);
            await this.uploadImages(Object.values(coupon)[0].id, files.files);
            await Promise.all(
              coupon.map(async (item) => {
                const { files } = await this.getImages(item.id);
                item.images = files;
                return item.images, item.unit, item.images;
              }),
            );
            return coupon[0];
          }
        }
      } else {
        throw new HttpException(
          `Coupon type must be percentage or cash...`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Post('transaction')
  public async addCouponForUser(
    @Query('email') email: string,
    @Query('code') code: string,
    @Query('quantity') quantity: number,
  ) {
    try {
      const pointUser = await this.pointUserService.GetTotalPointForUser(email);
      if (!pointUser)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      const totalPoint = Object.values(pointUser[0])[0];
      const pointCoupon = await this.couponService.getCouponByCouponCode(code);

      if (pointCoupon.length == 0)
        throw new HttpException('Coupon has not found', HttpStatus.NOT_FOUND);

      if (pointCoupon) {
        const pointToAchieve = Object.values(pointCoupon)[0].pointToAchieve;
        if (totalPoint >= pointToAchieve * quantity) {
          const couponUser = await this.couponService.addCouponAndEmail(
            email,
            code,
            quantity,
          );
          return couponUser;
        } else {
          throw new HttpException(
            `Coupon has point greater than your current point or quantity is not allowed ...`,
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          `This coupon has not existed...`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get('all')
  public async GetAllCouponForAdmin(
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
    @Query('unit') unit?: string,
  ): Promise<CouponFilterResponse> {
    try {
      const data = await this.couponService.getAllCouponForAdmin(limit, offset);
      const total = await this.couponService.getTotalCouponsForAdmin();
      console.log(data.length);
      console.log(Object.values(total)[0]);
      if (Object.values(total)[0] > 0 && data.length > 0) {
        await Promise.all(
          data.map(async (item) => {
            const { files } = await this.getImages(item.id);
            const price = await this.getPrice(
              item.unit,
              unit || defaultCurrency,
              item.amount,
            );
            item.unit = price.unit;
            item.amount = price.amount;
            item.images = files;
            return item.images, item.unit, item.images;
          }),
        );

        return { data, pagination: total };
      }

      return { data: [], pagination: { total: 0 } };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get('users/all')
  public async GetAllOptionalPromotionForUser(
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
    @Query('unit') unit?: string,
  ): Promise<CouponFilterResponse> {
    try {
      const data = await this.couponService.getAllCouponForUser(limit, offset);
      const total = await this.couponService.getTotalCouponsForUser();
      if (Object.values(total)[0] > 0 && data.length > 0) {
        await Promise.all(
          data.map(async (item) => {
            const { files } = await this.getImages(item.id);
            const price = await this.getPrice(
              item.unit,
              unit || defaultCurrency,
              item.amount,
            );
            item.unit = price.unit;
            item.amount = price.amount;
            item.images = files;
            return item.images, item.unit, item.images;
          }),
        );

        return { data, pagination: total };
      }

      return { data: [], pagination: { total: 0 } };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  @Get('total')
  public async getTotalPriceForOrder(
    @Body() fixedTotalPriceDto: FixedTotalPriceDto,
  ) {
    try {
      const price = await this.getPrice(
        fixedTotalPriceDto.unit,
        defaultCurrency,
        fixedTotalPriceDto.totalPrice,
      );
      fixedTotalPriceDto.totalPrice = price.amount;
      fixedTotalPriceDto.unit = price.unit;

      const couponCode = await this.couponService.getCouponByCouponCode(
        fixedTotalPriceDto.code,
      );
      if (couponCode.length == 0)
        throw new HttpException('Coupon has not found', HttpStatus.NOT_FOUND);

      if (Object.values(couponCode)[0].couponType == 'cash') {
        let total = (
          fixedTotalPriceDto.totalPrice - Object.values(couponCode)[0].amount
        ).toFixed(2);
        const updatedUserCoupon = await this.couponService.updateUserCoupon(
          fixedTotalPriceDto.email,
          fixedTotalPriceDto.code,
        );
        return {
          status: updatedUserCoupon ? 'Failed' : 'Success',
          total: Number(total) <= 0 ? 0 : total,
          unit: defaultCurrency,
        };
      } else if (Object.values(couponCode)[0].couponType == 'percentage') {
        let total = (
          fixedTotalPriceDto.totalPrice -
          (fixedTotalPriceDto.totalPrice *
            Object.values(couponCode)[0].modifier) /
            100
        ).toFixed(2);
        const updatedUserCoupon = await this.couponService.updateUserCoupon(
          fixedTotalPriceDto.email,
          fixedTotalPriceDto.code,
        );
        return {
          status: updatedUserCoupon ? 'Failed' : 'Success',
          total: Number(total) <= 0 ? 0 : total,
          unit: defaultCurrency,
        };
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get('/all/type')
  public async GetCouponByCouponTypeForAdmin(
    @Query('couponType') couponType: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('unit') unit?: string,
  ): Promise<CouponFilterResponse> {
    try {
      const data = await this.couponService.getCouponByCouponTypeForAdmin(
        couponType,
        limit,
        offset,
      );
      const total = await this.couponService.getTotalCouponTypeForAdmin(
        couponType,
      );

      if (Object.values(total)[0] > 0 && data.length > 0) {
        await Promise.all(
          data.map(async (item) => {
            const { files } = await this.getImages(item.id);
            const price = await this.getPrice(
              item.unit,
              unit || defaultCurrency,
              item.amount,
            );
            item.unit = price.unit;
            item.amount = price.amount;
            item.images = files;
            return item.images, item.unit, item.images;
          }),
        );
        return { data, pagination: total };
      }
      return { data: [], pagination: { total: 0 } };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Get()
  public async GetCouponsPaginationForUser(
    @Query('email') email: string,
    @Query('unit') unit?: string,
  ): Promise<CouponFilterResponse> {
    try {
      // if (!limit && !offset) {
      //   throw new BadRequestException(`Request doesn't have limit or offset`);
      // }

      const data = await this.couponService.CouponsPagination(
        email,
        // limit,
        // offset,
      );
      // const total = await this.couponService.getTotalCouponsForEmail(email);
      if (!Object.values(data)[0] == false) {
        await Promise.all(
          data.map(async (item) => {
            const { files } = await this.getImages(item.id);
            const price = await this.getPrice(
              item.unit,
              unit || defaultCurrency,
              item.amount,
            );
            item.unit = price.unit;
            item.amount = price.amount;
            item.images = files;
            return item.images, item.unit, item.images;
          }),
        );
        return { data };
      }
      return { data };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Get('/name/details')
  public async GetCouponByCouponNameForAdmin(
    @Query('couponName') couponName: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('unit') unit?: string,
  ): Promise<CouponFilterResponse> {
    try {
      const data = await this.couponService.getCouponByCouponNameForAdmin(
        couponName,
        limit,
        offset,
      );
      const total = await this.couponService.getTotalCouponNameForAdmin(
        couponName,
      );

      if (!Object.values(data)[0] == false && Object.values(total)[0] > 0) {
        await Promise.all(
          data.map(async (item) => {
            const { files } = await this.getImages(item.id);
            const price = await this.getPrice(
              item.unit,
              unit || defaultCurrency,
              item.amount,
            );
            item.unit = price.unit;
            item.amount = price.amount;
            item.images = files;
            return item.images, item.unit, item.images;
          }),
        );
        return { data, pagination: total };
      }
      return { data: [], pagination: { total: 0 } };
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @UseFilters(new ExceptionFilter())
  @Get('/code/details')
  public async GetCouponByCouponCodeForAdmin(
    @Query('code') code: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    try {
      const data = await this.couponService.getCouponByCouponCodeForAdmin(
        code,
        limit,
        offset,
      );

      if (!Object.values(data)[0] == false) {
        await Promise.all(
          data.map(async (item) => {
            const { files } = await this.getImages(item.id);
            item.images = files;
            return item.images;
          }),
        );
        return { data };
      }
      return [];
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Patch()
  public async updateCoupon(
    @Query('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    try {
      if (Object.values(CouponType)?.includes(updateCouponDto.couponType)) {
        if (updateCouponDto.isUnlimited == 'true') {
          if (updateCouponDto.couponType == 'cash') {
            updateCouponDto.modifier = 0;
            updateCouponDto.limit = 0;
            const coupon = await this.couponService.updateCoupon(id, {
              ...updateCouponDto,
            });
            return coupon[0];
          } else if (updateCouponDto.couponType == 'percentage') {
            updateCouponDto.amount = 0;
            updateCouponDto.limit = 0;

            const coupon = await this.couponService.updateCoupon(id, {
              ...updateCouponDto,
            });
            return coupon[0];
          }
        } else if (updateCouponDto.isUnlimited == 'false') {
          if (updateCouponDto.couponType == 'cash') {
            updateCouponDto.modifier = 0;

            const coupon = await this.couponService.updateCoupon(id, {
              ...updateCouponDto,
            });
            return coupon[0];
          } else if (updateCouponDto.couponType == 'percentage') {
            updateCouponDto.amount = 0;

            const coupon = await this.couponService.updateCoupon(id, {
              ...updateCouponDto,
            });
            return coupon[0];
          }
        }
      } else {
        throw new HttpException(
          `Coupon has not this coupon type. Please try again...`,
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Patch('status')
  public async updateCouponStatus(@Query('id') id: string) {
    try {
      const coupon = await this.couponService.updateCouponStatus(id);
      if (Object.values(coupon)[0] == false)
        throw new HttpException(
          `Coupon doesn't have id like this... `,
          HttpStatus.BAD_REQUEST,
        );
      return coupon;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  @Delete('remove')
  public async removeCouponForAdmin(@Query('id') id: string) {
    try {
      const coupon = await this.couponService.removeCouponForAdmin(id);
      if (Object.values(coupon)[0] == false)
        throw new HttpException(
          `Coupon doesn't have id like this... `,
          HttpStatus.BAD_REQUEST,
        );
      return coupon;
    } catch (error) {
      this.logger.error(error.message);
      throw new HttpException(
        error.message,
        error?.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private async getImages(couponId: string): Promise<GetAllForOwnerResponse> {
    try {
      const { files } = await firstValueFrom(
        this.fileService
          .getAllForOwner({ ownerId: couponId })
          .pipe(timeout(15000)),
      );

      if (!files) return { files: [] };
      return { files };
    } catch (error) {
      this.logger.error('Error from storage service: ', error.message);
      return { files: [] };
    }
  }

  private async uploadImages(
    couponId: string,
    filesParam: Express.Multer.File[],
  ): Promise<UploadFilesForOwnerResponse> {
    const file = filesParam.map((index) => ({
      filename: index.originalname,
      buffer: index.buffer,
      mimetype: index.mimetype,
    }));
    const files = await firstValueFrom(
      this.fileService.uploadForOwner({
        ownerId: couponId,
        files: file,
      }),
    );
    return { urls: files[0] };
  }
  catch(error) {
    this.logger.error('Error from storage service: ', error.message);
    return { urls: [] };
  }

  private async getPrice(
    base: string,
    destination: string,
    amount: number,
  ): Promise<{ unit: string; amount: number }> {
    try {
      if (base == destination)
        return {
          unit: base,
          amount,
        };
      const amountResponse = await firstValueFrom(
        this.exchangeService.getAmount({ base, destination, amount }),
      );
      return {
        unit: destination,
        amount: +amountResponse.amount.toFixed(2),
      };
    } catch (error) {
      this.logger.error('Error from exchange rate service:', error.message);
      return {
        unit: base,
        amount: amount,
      };
    }
  }

  private async addCoupons(manyCouponDto: ManyCouponDto) {
    const coupon = await Promise.all(
      manyCouponDto.coupons.map(async (item) => {
        if (Object.values(CouponType)?.includes(item.couponType)) {
          if (
            item.couponType == CouponType.PERCENTAGE &&
            item.isUnlimited == 'true'
          ) {
            item.amount = 0;
            item.limit = 0;
            const coupons = await this.couponService.addCoupon({ ...item });
            return coupons;
          } else if (
            item.couponType == CouponType.CASH &&
            item.isUnlimited == 'true'
          ) {
            item.modifier = 0;
            item.limit = 0;
            const coupons = await this.couponService.addCoupon({ ...item });
            return coupons;
          }
        }
      }),
    );
    return coupon;
  }
}
