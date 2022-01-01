import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CouponFilter } from 'src/interfaces/Coupon/getCouponForClient';

import { CouponDto } from '../../dtos/Coupon.dto';
import { UpdateCouponDto } from '../../dtos/UpdateCoupon.dto';
import { Coupon } from '../../Models/Coupon.model';

@Injectable()
export class CouponService {
  private readonly logger = new Logger('CouponService');

  constructor(private sequelize: Sequelize, private httpService: HttpService) {}

  async addCoupon(couponDto: CouponDto): Promise<CouponFilter[]> {
    try {
      const inserted: CouponFilter[] = await this.sequelize.query(
        'SP_AddCoupon @couponType=:couponType,@couponName=:couponName,@description=:description,@modifier=:modifier,' +
          '@amount=:amount,@unit=:unit,@usage=:usage,@limit=:limit,' +
          '@startTime=:startTime,@endTime=:endTime,@pointToAchieve=:pointToAchieve',
        {
          type: QueryTypes.SELECT,
          replacements: {
            ...couponDto,
          },
          raw: true,
          // mapToModel: true,
          // model: Coupon,
        },
      );
      return inserted;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async updateCoupon(id: string, updateCouponDto: UpdateCouponDto) {
    try {
      const updated = await this.sequelize.query(
        'SP_UpdateCouponBase @id=:id,@couponType=:couponType,@couponName=:couponName,@description=:description,@modifier=:modifier,' +
          '@amount=:amount,@unit=:unit,@usage=:usage,@limit=:limit,' +
          '@startTime=:startTime,@endTime=:endTime,@pointToAchieve=:pointToAchieve',
        {
          type: QueryTypes.UPDATE,
          replacements: { id, ...updateCouponDto },
          raw: true,
          mapToModel: true,
          model: Coupon,
        },
      );
      return updated[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async removeCouponForAdmin(id: string) {
    try {
      const removed = await this.sequelize.query(
        'SP_RemoveCouponForAdmin @id=:id',
        {
          type: QueryTypes.DELETE,
          replacements: { id },
          raw: true,
          mapToModel: true,
          model: Coupon,
        },
      );
      return removed[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
  async updateCouponStatus(id: string) {
    try {
      const manipulated = await this.sequelize.query(
        'SP_ManipulateActiveForEachCoupon @id=:id',
        {
          type: QueryTypes.SELECT,
          replacements: { id },
          raw: true,
          mapToModel: true,
          model: Coupon,
        },
      );
      return manipulated[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
  async updateUserCoupon(email: string, code: string) {
    try {
      const updated = await this.sequelize.query(
        'SP_UpdateUserCouponTable @email=:email,@code=:code',
        {
          type: QueryTypes.SELECT,
          replacements: { email, code },
        },
      );
      return updated[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
  async addCouponAndEmail(email: string, code: string, quantity: number) {
    try {
      const inserted = await this.sequelize.query(
        'SP_AddCouponAndEmail @email=:email,@code=:code,@quantity=:quantity',
        {
          type: QueryTypes.SELECT,
          replacements: {
            email,
            code,
            quantity,
          },
        },
      );
      return inserted[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async CouponsPagination(
    email: string,
    // limit?: Number,
    // offset?: Number,
  ): Promise<CouponFilter[]> {
    try {
      const coupons: CouponFilter[] = await this.sequelize.query(
        'SP_GetAllCouponForUser @email=:email',
        {
          replacements: {
            email,
            // limit,
            // offset,
          },
          type: QueryTypes.SELECT,
          raw: true,
        },
      );
      return coupons;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getTotalCouponsForEmail(email: string) {
    try {
      const total = await this.sequelize.query(
        'SP_GetTotalCoupons @email=:email',
        {
          type: QueryTypes.SELECT,
          replacements: { email },
        },
      );
      return total[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getAllCouponForAdmin(
    limit?: Number,
    offset?: Number,
  ): Promise<CouponFilter[]> {
    try {
      if (limit < 1 || offset < 0) return [];
      const total: CouponFilter[] = await this.sequelize.query(
        'SP_GetAllCouponForAdmin @limit=:limit,@offset=:offset',
        {
          type: QueryTypes.SELECT,
          replacements: {
            limit,
            offset,
          },
          raw: true,
        },
      );
      return total;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
  async getAllCouponForUser(
    limit?: Number,
    offset?: Number,
  ): Promise<CouponFilter[]> {
    try {
      if (limit < 1 || offset < 0) return [];
      const total: CouponFilter[] = await this.sequelize.query(
        'SP_GetListOptionalPromotionForUser @limit=:limit,@offset=:offset',
        {
          type: QueryTypes.SELECT,
          replacements: {
            limit,
            offset,
          },
          raw: true,
        },
      );
      return total;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getCouponByCouponTypeForAdmin(
    couponType?: string,
    limit?: number,
    offset?: number,
  ): Promise<CouponFilter[]> {
    try {
      if (limit < 1 || offset < 0) return [];
      const coupon: CouponFilter[] = await this.sequelize.query(
        'SP_GetCouponByCouponType @couponType=:couponType,@limit=:limit,@offset=:offset',
        {
          type: QueryTypes.SELECT,
          replacements: {
            couponType,
            limit,
            offset,
          },
          raw: true,
        },
      );
      return coupon;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getCouponByCouponNameForAdmin(
    couponName?: string,
    limit?: number,
    offset?: number,
  ): Promise<CouponFilter[]> {
    try {
      if (limit < 1 || offset < 0) return [];
      const coupon: CouponFilter[] = await this.sequelize.query(
        'SP_GetCouponByCouponNameForAdmin @couponName=:couponName,@limit=:limit,@offset=:offset',
        {
          type: QueryTypes.SELECT,
          replacements: {
            couponName,
            limit,
            offset,
          },
          raw: true,
        },
      );
      return coupon;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getTotalCouponsForAdmin() {
    try {
      const total = await this.sequelize.query('SP_GetTotalCouponsForAdmin', {
        type: QueryTypes.SELECT,
        raw: true,
        mapToModel: true,
        model: Coupon,
      });
      return total[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getTotalCouponsForUser() {
    try {
      const total = await this.sequelize.query(
        'SP_GetTotalOptionalPromotionForUser',
        {
          type: QueryTypes.SELECT,
          raw: true,
          mapToModel: true,
          model: Coupon,
        },
      );
      return total[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getTotalCouponTypeForAdmin(couponType: string) {
    try {
      const total = await this.sequelize.query(
        'SP_GetTotalCouponTypeForAdmin @couponType=:couponType',
        {
          type: QueryTypes.SELECT,
          replacements: { couponType },
          raw: true,
          mapToModel: true,
          model: Coupon,
        },
      );
      return total[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getTotalCouponNameForAdmin(couponName?: string) {
    try {
      const total = await this.sequelize.query(
        'SP_GetTotalCouponNameForAdmin @couponName=:couponName',
        {
          type: QueryTypes.SELECT,
          replacements: { couponName },
          raw: true,
          mapToModel: true,
          model: Coupon,
        },
      );
      return total[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getCouponByCouponCodeForAdmin(
    code?: string,
    limit?: number,
    offset?: number,
  ): Promise<CouponFilter[]> {
    try {
      if (limit < 1 || offset < 0) return [];
      const coupon: CouponFilter[] = await this.sequelize.query(
        'SP_GetCouponByCouponCodeForAdmin @code=:code,@limit=:limit,@offset=:offset',
        {
          type: QueryTypes.SELECT,
          replacements: {
            code,
            limit,
            offset,
          },
          raw: true,
        },
      );
      return coupon;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async getCouponByCouponCode(code?: string): Promise<CouponFilter[]> {
    try {
      const coupon: CouponFilter[] = await this.sequelize.query(
        'SP_GetCouponByCouponCode @code=:code',
        {
          type: QueryTypes.SELECT,
          replacements: {
            code,
          },
          raw: true,
        },
      );
      return coupon;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
}
