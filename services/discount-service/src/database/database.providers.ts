import { Sequelize } from 'sequelize-typescript';
import { databaseToken } from '../constants';
import { ProductDiscount } from '../entities/productDiscount.entity';
import { Discount } from '../entities/discount.entity';
import { Product } from '../entities/products.entity';

export const databaseProviders = [
  {
    provide: databaseToken,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mssql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      sequelize.authenticate();
      sequelize.addModels([Discount, Product, ProductDiscount]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
