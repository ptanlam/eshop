import { ProductDiscount } from '../../entities/productDiscount.entity';
import { Product } from '../../entities/products.entity';
import { IStrategy } from './statergy';

export class ProductStrategy implements IStrategy {
  productRepository: typeof Product;
  productDiscountRepository: typeof ProductDiscount;
  constructor(
    productRepository: typeof Product,
    productDiscountRepository: typeof ProductDiscount,
  ) {
    this.productRepository = productRepository;
    this.productDiscountRepository = productDiscountRepository;
  }
  async findOrCreateEntity(id: string) {
    try {
      const [product, exist] =
        await this.productRepository.findOrCreate<Product>({
          where: { id: id },
        });
      return product;
    } catch (error) {
      return error;
    }
  }
  async findOrCreateRelationship(discountId: string, productId: string) {
    try {
      const [productDiscount, exist] =
        await this.productDiscountRepository.findOrCreate<ProductDiscount>({
          where: { productId: productId, discountId: discountId },
        });
      return productDiscount;
    } catch (error) {
      return error;
    }
  }
  async findDiscountIdByEntityId(
    productIds: string[],
  ): Promise<{ discountId: string }[]> {
    try {
      const discountIds = this.productDiscountRepository.findAll({
        where: { productId: productIds },
        attributes: ['discountId', 'productId'],
      });
      return discountIds;
    } catch (error) {
      return error;
    }
  }
}
