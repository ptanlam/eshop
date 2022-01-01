import { ConfigService } from '@nestjs/config';
import { from } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { File } from '../files/entities/file.entity';
import { databaseProvideToken } from '../constants';

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
      sequelize.addModels([File]);

      return from(sequelize.sync());
    },
  },
];
