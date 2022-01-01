import { ConfigService } from '@nestjs/config';
import { from, map } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { databaseProvideToken } from '../../constants';
import { Target, Review, Reviewer } from '../../domain/models';

export const databaseProvider = [
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
      sequelize.addModels([Review, Target, Reviewer]);

      return from(sequelize.sync());
    },
  },
];
