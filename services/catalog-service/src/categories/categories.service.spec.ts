import { BadRequestException, HttpException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Sequelize } from 'sequelize-typescript';
import { ProductsService } from '../products/products.service';
import CreateProductDtoStub from '../stubs/create-product.dto.stub';
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto } from './dto/create-catalog.dto';
describe('CategoriesService', () => {
  let service: CategoriesService;
  let productService: ProductsService;
  let sequelize: Sequelize;

  sequelize = new Sequelize({
    dialect: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: 'Admin@123',
    database: 'Catalog_Service_Db',
  });

  let initData: CreateCategoriesDto[] = [
    { name: 'Parent Category 1', parentName: null },
    {
      name: 'Child Category 1',
      parentName: 'Parent Category 1',
    },
  ];
  let parentCategoryId: string;
  let childCategoryId: string;
  let sampleProduct;
  let productStub = CreateProductDtoStub;
  beforeAll(async () => {
    service = new CategoriesService(sequelize);
    productService = new ProductsService(sequelize);
    initData.forEach(async (cate, index) => {
      const newCate = await service.registerCategory(cate);

      if (index == 0) {
        parentCategoryId = newCate.id;
      } else {
        childCategoryId = newCate.id;
      }
    });

    productStub.categoryId = childCategoryId;
    sampleProduct = await productService.addProduct(productStub);
  });

  afterAll(async () => {
    await sequelize.query(`DELETE FROM [dbo].[CategoryProduct]
    DELETE FROM [dbo].[Attributes]
    DELETE FROM [dbo].[Products]
    DELETE FROM [dbo].[Categories]
    DELETE FROM [dbo].[ProductGroups]`);
    await sequelize.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register categories', () => {
    it('should create a parent categories', async () => {
      const result = await service.registerCategory({
        name: 'Parent categories 2',
        parentName: null,
      });
      expect(result.parentId).toBeFalsy();
      expect(result.name).toEqual('Parent categories 2');
      expect(result.depth).toEqual(1);
    });

    it('should create a child categories', async () => {
      const result = await service.registerCategory({
        name: 'Child categories 2',
        parentName: initData[0].name,
      });

      expect(result.parentId).toBeTruthy();
      expect(result.name).toEqual('Child categories 2');
      expect(result.depth).toEqual(2);
    });

    it('should return a bad request error when parent is not exist', async () => {
      try {
        await service.registerCategory({
          name: 'Child categories 3',
          parentName: 'Wrong parent',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('add a product', () => {
    it('should a product to category', async () => {
      const result = await service.addProductToCategory(
        sampleProduct.id,
        childCategoryId,
      );

      expect(result.id).toEqual(childCategoryId);
    });

    it(`should throw error when product doesn't exist to category`, async () => {
      try {
        await service.addProductToCategory(randomUUID(), childCategoryId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('get categories', () => {
    it('get filter name', async () => {
      const result = await service.getNameFilter();
      expect(result.length).toEqual(4);
    });

    it('get all categories', async () => {
      const [result, error] = await service.getAllCategories();

      expect(error).toBeNull();
      expect(result.length).toEqual(2);
    });

    it('should return category by id', async () => {
      const result = await service.getCategoryById(parentCategoryId);
      expect(result.name).toEqual(initData[0].name);
    });
  });

  describe('check for empty jsonRecord array', () => {
    it('empty array', () => {
      const result = service.isEmptyJsonRecord([[], 0]);
      expect(result).toBeTruthy();
    });

    it('none empty array', () => {
      const result = service.isEmptyJsonRecord([['abc'], 1]);
      expect(result).toBeFalsy();
    });
  });
});
