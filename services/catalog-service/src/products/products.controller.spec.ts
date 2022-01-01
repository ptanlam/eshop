import { query } from 'express';
import { productStub } from '../stubs/products.stub';
import CategoriesService from '../mocks/categories.service';
import ProductsService from '../mocks/products.service';
import S3Service from '../mocks/s3.service';
import { ProductsController } from './products.controller';

describe('ProductsController', () => {
  const controller: ProductsController = new ProductsController(
    ProductsService,
    CategoriesService,
  );
  describe('adjustProductStock', () => {
    let product;
    let response = {
      status: 200,
      message: 'Adjustment successfully',
      data: {
        oldStock: 3,
        adjustAmount: 1,
        newStock: 2,
      },
    };
    let query = { id: '', amount: 2 };
    describe('adjustProductStock called', () => {
      beforeEach(async () => {
        product = await controller.adjustProductStock(query);
      });
      test('adjustProduct when have enough product in stock for order', () => {
        expect(product).toStrictEqual(response);
      });
    });
  });
});
