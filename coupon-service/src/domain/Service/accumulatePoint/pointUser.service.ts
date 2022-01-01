import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AccumulatePoint } from 'src/domain/Models/AccumulatePoint.model';

@Injectable()
export class PointUserService {
  private readonly logger = new Logger('PointUserService');

  constructor(private sequelize: Sequelize) {}

  async AddAccumulatePoint(email: string, basePoint: number) {
    try {
      const inserted = await this.sequelize.query(
        'SP_AddPointForUser @email=:email,@basePoint=:basePoint',
        {
          type: QueryTypes.SELECT,
          replacements: {
            email,
            basePoint,
          },
          raw: true,
          mapToModel: true,
          model: AccumulatePoint,
        },
      );
      return inserted[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }

  async AddAccumulatePointDetails(
    accumulatePointId: string,
    orderId: string,
    totalPrice: number,
    unit: string,
  ) {
    try {
      const inserted = await this.sequelize.query(
        'SP_AddPointForUser_Details @accumulatePointId=:accumulatePointId,@orderId=:orderId,@totalPrice=:totalPrice,@unit=:unit',
        {
          type: QueryTypes.SELECT,
          replacements: {
            accumulatePointId,
            orderId,
            totalPrice,
            unit,
          },
        },
      );
      return inserted[0];
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
  async GetTotalPointForUser(email: string) {
    try {
      const totalPoint = await this.sequelize.query(
        'SP_GetTotalPointForUser @email=:email',
        {
          type: QueryTypes.SELECT,
          replacements: { email },
          raw: true,
        },
      );
      return totalPoint;
    } catch (error) {
      this.logger.error(error.message);
      throw new DatabaseError(error);
    }
  }
}
