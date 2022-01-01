import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { json } from 'sequelize';
import { CouponModule } from './coupon.module';
import { CouponService } from './coupon.service';

describe('couponService', () => {
  let couponService: CouponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponService],
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.development'],
        }),
        SequelizeModule.forRoot({
          dialect: 'mssql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }),
        CouponModule,
      ],
    }).compile();

    couponService = module.get<CouponService>(CouponService);
  });
});
