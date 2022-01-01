import { HttpException, Injectable } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import slugify from 'slugify';
import { Products } from '../entities/products.entity';
import { FilterProductDto } from '../products/dto/filter-product.dto';
import { jsonParse } from '../utils/jsonParse.util';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly sequelize: Sequelize) {}

  async getCategoryListForVendor(
    brandId: string,
  ): Promise<Array<{ id: string; name: string }>> {
    try {
      const categoryList = await this.sequelize.query<{
        id: string;
        name: string;
      }>('uspGetCategoryListForVendor @brandId=:brandId', {
        type: QueryTypes.SELECT,
        replacements: { brandId },
      });
      return categoryList;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async productSearch(filterProductDto: FilterProductDto) {
    try {
      const { price, ...rest } = filterProductDto;
      const jsonRecord = await this.sequelize.query(
        'SP_ProductFilter @productName =:name ,' +
          '@categoryId =:categoryId, ' +
          '@gt=:gt, ' +
          '@lt=:lt, ' +
          '@limit =:limit, ' +
          '@offset =:offset, ' +
          '@sort=:sort, ' +
          '@order=:order, ' +
          '@brandId=:brandId',
        {
          type: QueryTypes.RAW,
          replacements: { ...price, ...rest },
        },
      );
      return jsonParse(jsonRecord);
    } catch (error) {
      return error;
    }
  }

  async getShortProducts(productIds: string[]) {
    try {
      const res = await Promise.all(
        productIds.map(async (id) => {
          const jsonRecord = await this.sequelize.query(
            'SP_GetShortProducts @id=:id',
            {
              type: QueryTypes.RAW,
              replacements: { id },
            },
          );
          const product = await jsonParse(jsonRecord);
          return product[0];
        }),
      );
      return res;
    } catch (error) {
      return error;
    }
  }

  async productCount(productName: string) {
    try {
      const count = await this.sequelize.query(
        'SP_ProductCount @productName=:productName',
        { type: QueryTypes.SELECT, replacements: { productName } },
      );
      return count[0];
    } catch (error) {
      return error;
    }
  }

  async autoCompleteName(name: string) {
    try {
      const jsonRecord = await this.sequelize.query(
        'SP_NameAutoSearch @name=:name',
        {
          type: QueryTypes.RAW,
          replacements: { name },
        },
      );
      if (jsonRecord[1] === 0) return [];
      const products = await jsonParse(jsonRecord);
      return products;
    } catch (error) {
      return error;
    }
  }

  async adjustProductStock(items: [{ productId: string; quantity: number }]) {
    try {
      const respond = await Promise.all(
        items.map(async (item) => {
          const product = await this.getProductById(item.productId);
          if (product.stock > item.quantity) {
            const jsonRecord = await this.sequelize.query(
              'SP_AdjustProductAmount @id=:id, @amount=:amount',
              {
                type: QueryTypes.RAW,
                raw: true,
                replacements: {
                  id: item.productId,
                  amount: item.quantity,
                },
              },
            );
            const res = await jsonParse(jsonRecord);
            return {
              productName: product.name,
              quantity: item.quantity,
              ...res,
            };
          } else {
            return {
              productName: product.name,
              isOutOfStock: true,
            };
          }
        }),
      );
      return respond;
    } catch (error) {
      return error;
    }
  }

  async updateCategories(productId: string, categoryName: string) {
    try {
      const updatedCategories = await this.sequelize.query(
        'SP_UpdateCategoryProduct @productId=:productId, @categoryName=:categoryName',
        {
          type: QueryTypes.SELECT,
          raw: true,
          replacements: { productId, categoryName },
        },
      );
      return [updatedCategories, null];
    } catch (error) {
      return [null, error];
    }
  }

  async updateProduct(updatedProductDto: UpdateProductDto) {
    // try {
    //   const updatedProduct = await this.sequelize.query(
    //     'SP_UpdateProduct @id=:id, @name=:name, ' +
    //       '@description=:description, @price=:price, ' +
    //       '@stock=:stock, @unit=:unit ',
    //     {
    //       type: QueryTypes.SELECT,
    //       replacements: {
    //         id: updatedProductDto.id,
    //         name: updatedProductDto?.name ?? null,
    //         description: updatedProductDto?.description ?? null,
    //         price: updatedProductDto?.price ?? null,
    //         stock: updatedProductDto?.stock ?? null,
    //         unit: updatedProductDto?.unit ?? null,
    //       },
    //       raw: true,
    //       mapToModel: true,
    //     },
    //   );
    //   return [null, null];
    // } catch (error) {
    //   return [null, error];
    // }
  }

  async updateAttribute(
    id: string,
    type?: string,
    name?: string,
    values?: string[],
  ) {}

  async getProductById(id: string) {
    try {
      const jsonRecord = await this.sequelize.query(
        `SP_GetProductById '${id}'`,
        {
          type: QueryTypes.RAW,
          raw: true,
        },
      );
      if (this.isEmptyJsonRecord(jsonRecord)) return {};
      const product = jsonParse(jsonRecord);
      return product;
    } catch (error) {
      throw new HttpException(error.message, error.code);
    }
  }

  async addProduct(dto: CreateProductDto): Promise<Products> {
    try {
      const slug = slugify(dto.name, { lower: true, trim: true });
      const product = await this.sequelize.query(
        'SP_AddProduct @name=:name,' +
          '@briefDescription=:briefDescription,' +
          '@detailDescription=:detailDescription,' +
          '@price=:price, ' +
          '@stock=:stock, ' +
          '@unit=:unit, ' +
          '@slug=:slug, ' +
          '@brandId=:brandId',
        {
          type: QueryTypes.SELECT,
          replacements: {
            name: dto.name.trim(),
            briefDescription: dto.briefDescription,
            detailDescription: dto.detailDescription,
            price: dto.price,
            stock: dto.stock,
            unit: dto.unit,
            slug,
            brandId: dto.brandId,
          },
          raw: true,
          mapToModel: true,
          model: Products,
        },
      );
      dto.attributes.forEach((att) => {
        this.addAttribute(att.name, att.value, product[0].id);
      });
      return product[0];
    } catch (error) {
      throw new HttpException(error.message, error.code);
    }
  }

  addAttribute(name, value, productId) {
    this.sequelize.query(
      'SP_AddAttribute @name=:name, @value=:value, @productId=:productId',
      {
        replacements: { name, value, productId },
      },
    );
  }

  async getNonUsdProduct(): Promise<
    Array<Pick<Products, 'id' | 'price' | 'unit'>>
  > {
    const res = await this.sequelize.query<
      Pick<Products, 'id' | 'price' | 'unit'>
    >('uspGetNonUsdProduct', {
      type: QueryTypes.SELECT,
    });

    return res;
  }

  isEmptyJsonRecord(jsonRecord = new Array()) {
    if (!jsonRecord[1]) return true;
    else false;
  }
}
