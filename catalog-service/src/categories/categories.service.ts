import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import slugify from 'slugify';
import { Categories } from '../entities/categories.entity';
import { jsonParse } from '../utils/jsonParse.util';
import { CreateCategoriesDto } from './dto/create-catalog.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly sequelize: Sequelize) {}

  async getNameFilter() {
    try {
      const jsonRecord = await this.sequelize.query('SP_GetChildrenName');
      if (this.isEmptyJsonRecord(jsonRecord)) return [];
      return await jsonParse(jsonRecord);
    } catch (error) {
      return error;
    }
  }

  async getAllCategories() {
    try {
      const jsonRecord = await this.sequelize.query('SP_GetAllCategories', {
        type: QueryTypes.RAW,
        raw: true,
      });
      if (this.isEmptyJsonRecord(jsonRecord)) {
        return [[], null];
      }
      const categories = jsonParse(jsonRecord);
      return [categories, null];
    } catch (error) {
      return [null, error];
    }
  }

  async countProductByCategory(id: string) {
    try {
      const count = await this.sequelize.query(
        'SP_CountProductByCategory @id=:id',
        { type: QueryTypes.SELECT, replacements: { id }, raw: true },
      );
      return count[0];
    } catch (error) {
      return error;
    }
  }

  async getProductsByCategoryId(id: string, limit: number, offset: number) {
    try {
      const jsonRecord = await this.sequelize.query(
        'SP_GetProductsByCategoryId @id=:id, @limit=:limit,@offset=:offset',
        {
          type: QueryTypes.RAW,
          raw: true,
          replacements: { id, limit, offset },
        },
      );
      const products = await jsonParse(jsonRecord);
      return products;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async registerCategory(dataDto: CreateCategoriesDto) {
    try {
      const defaultValue = new CreateCategoriesDto();
      const data = { ...defaultValue, ...dataDto };

      const slug = slugify(data.name, { lower: true, trim: true });
      const categories = await this.sequelize.query(
        'SP_AddCategory @name =:name, @parentName =:parentName, @slug=:slug',
        {
          type: QueryTypes.SELECT,
          replacements: {
            name: data.name,
            parentName: data.parentName,
            slug,
          },
          raw: true,
          mapToModel: true,
          model: Categories,
        },
      );
      return categories[0];
    } catch (error) {
      if (error?.parent?.code === 'EREQUEST')
        throw new HttpException(
          'Parent category does not exist!',
          HttpStatus.BAD_REQUEST,
        );
      throw new HttpException(error.message, error.code);
    }
  }

  async addProductToCategory(
    productId: string,
    categoryId: string,
  ): Promise<Categories> {
    try {
      const res = await this.sequelize.query(
        'SP_AddProductToCategory @productId=:productId, @categoryId=:categoryId',
        {
          type: QueryTypes.SELECT,
          replacements: { productId, categoryId },
          raw: true,
          mapToModel: true,
          model: Categories,
        },
      );
      return res[0];
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getCategoryById(id: string) {
    const res = await this.sequelize.query(
      `SELECT * FROM Categories WHERE id = '${id}'`,
      {
        type: QueryTypes.SELECT,
        raw: true,
        mapToModel: true,
        model: Categories,
      },
    );
    if (!res[0]) {
      throw new BadRequestException(`Category with id:${id} doesn't exist`);
    }
    return res[0];
  }

  isEmptyJsonRecord(jsonRecord = new Array()) {
    if (jsonRecord[1] === 0) return true;
    else false;
  }
}
