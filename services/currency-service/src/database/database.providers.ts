import { ConfigService } from '@nestjs/config';
import { from } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { databaseProvideToken } from '../constants';
import { ExchangeRate } from '../exchange-rates/entities/exchange-rate.entity';

export const databaseProviders = [
  {
    provide: databaseProvideToken,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mssql',
        host: configService.get('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
      });

      sequelize.authenticate();
      sequelize.addModels([ExchangeRate]);

      return from(sequelize.sync());
    },
  },
];
