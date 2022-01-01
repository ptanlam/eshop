import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';

import { PointUserModule } from './pointUser.module';
import { PointUserService } from './pointUser.service';

describe("pointUserService", () => {
  let pointUserService: PointUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PointUserService],
      imports: [
        ConfigModule.forRoot({
          envFilePath: [".env.development"],
        }),
        SequelizeModule.forRoot({
          dialect: "mssql",
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }),
        PointUserModule,
      ],
    }).compile();

    pointUserService = module.get<PointUserService>(PointUserService);
  });
});
