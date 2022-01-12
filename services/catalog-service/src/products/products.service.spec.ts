import { async } from 'rxjs';
import { Sequelize } from 'sequelize-typescript';
import { CategoriesService } from '../categories/categories.service';
import CreateProductDtoStub from '../stubs/create-product.dto.stub';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let sequelize: Sequelize;
  sequelize = new Sequelize({
    dialect: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: 'Admin@123',
    database: 'Catalog_Service_Db',
  });
  let categoryService: CategoriesService = new CategoriesService(sequelize);
  service = new ProductsService(sequelize);
  let categoryId;
  let productId;

  beforeAll(async () => {
    const cate = await categoryService.registerCategory({
      name: 'Parent 1',
      parentName: null,
    });
    categoryId = cate.id;
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

  describe('create product', () => {
    it('add product', async () => {
      const result = await service.addProduct({
        ...CreateProductDtoStub,
        categoryId,
      });
      productId = result.id;
      await categoryService.addProductToCategory(result.id, categoryId);
      expect(result.name).toEqual(CreateProductDtoStub.name);
      expect(result.briefDescription).toEqual(
        CreateProductDtoStub.briefDescription,
      );
      expect(result.detailDescription).toEqual(
        CreateProductDtoStub.detailDescription,
      );
      expect(result.price).toEqual(CreateProductDtoStub.price);
      expect(result.stock).toEqual(CreateProductDtoStub.stock);
    });
  });

  describe('get product', () => {
    it('search product by category id', async () => {
      const result = await service.productSearch({
        limit: 10,
        offset: 0,
        categoryId,
        name: null,
        brandId: null,
        order: null,
        price: { gt: null, lt: null },
        sort: null,
        unit: null,
      });

      expect(result.data[0].name).toEqual(CreateProductDtoStub.name);
      expect(result.pagination.total).toEqual(1);
      expect(result.meta.maxPrice).toEqual(CreateProductDtoStub.price);
    });

    it('search product by name', async () => {
      const result = await service.productSearch({
        limit: 10,
        offset: 0,
        categoryId,
        name: 't',
        brandId: null,
        order: null,
        price: { gt: null, lt: null },
        sort: null,
        unit: null,
      });
      expect(result.data[0].name).toEqual(CreateProductDtoStub.name);
      expect(result.pagination.total).toEqual(1);
      expect(result.meta.maxPrice).toEqual(CreateProductDtoStub.price);
    });

    it('get product by id', async () => {
      const result = await service.getProductById(productId);
      expect(result.name).toEqual(CreateProductDtoStub.name);
      expect(result.briefDescription).toEqual(
        CreateProductDtoStub.briefDescription,
      );
      expect(result.detailDescription).toEqual(
        CreateProductDtoStub.detailDescription,
      );
      expect(result.price.amount).toEqual(CreateProductDtoStub.price);
      expect(result.stock).toEqual(CreateProductDtoStub.stock);
    });

    it('get non usd product', async () => {
      const result = await service.getNonUsdProduct();
      expect(result).toHaveLength(1);
    });
  });

  describe('remove products', () => {
    it('remove product', async () => {
      const result = await service.removeProducts(productId);
      expect(result[0].id).toEqual(productId);
    });
  });
});
