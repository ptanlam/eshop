import { Sequelize } from 'sequelize-typescript';
import { CategoriesService } from '../categories/categories.service';
import { BrandsService } from '../brands/brands.service';
import ReviewsService from '../mocks/reviews.service';
import { CreateProductDtoStub } from '../stubs/create-product.dto.stub';
import { Attribute } from './dto/attributes.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { Images } from './dto/images.dto';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let sequelize: Sequelize;
  sequelize = new Sequelize({
    dialect: 'mssql',
    host: 'localhost',
    port: 1433,
    username: 'sa',
    password: 'abc!123ABC',
    database: 'Catalog_Service_Test_DB',
  });
  let brandService: BrandsService = new BrandsService(sequelize);
  let categoryService: CategoriesService = new CategoriesService(sequelize);
  service = new ProductsService(sequelize, ReviewsService);
  let product;

  beforeAll(async () => {
    await brandService.findOrCreate(CreateProductDtoStub().brand);
    await categoryService.registerCategory('Parent 1');
    await categoryService.registerCategory(
      CreateProductDtoStub().categoryName,
      'Parent 1',
    );
  });

  afterAll(async () => {
    await sequelize.query('SP_DeleteAllData');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create a full product', () => {
    let error;
    let attribute;
    it('should add new product and return product entity', async () => {
      let expected = [
        'id',
        'groupId',
        'attributeSetId',
        'name',
        'description',
        'price',
        'stock',
        'active',
        'unit',
        'slug',
        'createdAt',
        'updatedAt',
        'brandId',
      ];
      [product, error] = await service.addProduct(CreateProductDtoStub());
      expect(Object.keys(product)).toEqual(expected);
    });
    it('should add attribute to product and return attribute entity', async () => {
      [attribute, error] = await service.addAttribute('test type', 'test name');
      expect(Object.keys(attribute)).toEqual(['id', 'type', 'name']);

      const [respond, error1] = await service.addAttributeProductValue(
        attribute.id,
        product.id,
      );
      expect(respond[0].length).toBe(0);
    });
    it('should add value to attribute', async () => {
      const [values, error] = await service.addAttributeValue(attribute.id, [
        'test',
        'test',
        'test',
      ]);
      await values.forEach((value) => {
        expect(Object.keys(value)).toEqual(['id', 'attributeId', 'value']);
      });
    });

    it('should add attribute set to product', async () => {
      let expected = ['attributes', 'value'];
      let attributes = new Attribute();
      attributes.name = 'name';
      attributes.type = 'type';
      attributes.values = ['test'];
      const [res, error] = await service.addAttributeSet(
        'test',
        [attributes],
        product.id,
      );
      expect(Object.keys(res[0])).toEqual(expected);
    });

    it('should add product to categories', async () => {
      const res = await categoryService.addProductToCategory(
        product.id,
        CreateProductDtoStub().categoryName,
      );
      expect(res).toBeDefined();
    });

    it('should add imageUrl to database', async () => {
      let expected = ['id', 'ownerId', 'imageUrl', 'order'];
      let images: Images;
      images = new Images(product.id, 'image.url', 1);
      const res = await service.addImage(images);
      expect(Object.keys(res[0])).toEqual(expected);
    });
  });
  describe('product search', () => {
    it('should return product with condition', async () => {
      let conditions = new FilterProductDto(
        null,
        'l',
        10,
        0,
        { gt: null, lt: null },
        'name',
        'asc',
        null,
      );
      const products = await service.productSearch(conditions);
      expect(products.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should count number of product with name parameter', async () => {
      const product = await service.productCount('t');
      expect(product.total).toBeGreaterThanOrEqual(1);
    });

    it('should return array product name', async () => {
      let expected = ['category', 'products'];
      const productName = await service.autoCompleteName('t');
      expect(Object.keys(productName[0])).toEqual(expected);
      expect(productName[0].products.length).toBeGreaterThanOrEqual(1);
    });

    it('should return product in short format', async () => {
      let expected = ['id', 'name', 'description', 'price', 'slug', 'images'];
      const products = await service.getShortProducts([product.id]);
      expect(Object.keys(products[0])).toEqual(expected);
    });

    it('should return product with name parameter', async () => {
      let expected = [
        'id',
        'name',
        'description',
        'price',
        'slug',
        'images',
        'brand',
      ];
      const products = await service.productNameSearch('t', 10, 0);
      expect(Object.keys(products[0])).toEqual(expected);
    });

    it('should return product with id parameter', async () => {
      let expected = [
        'id',
        'name',
        'description',
        'stock',
        'price',
        'slug',
        'attribute',
        'attributeSet',
        'images',
        'brand',
      ];
      const [res, error] = await service.getProductById(product.id);
      expect(Object.keys(res)).toEqual(expected);
    });
  });

  describe('product update', () => {
    describe('adjust product stock', () => {
      it('should remove stock and return number of stock left if number of stock is higher than quantity', async () => {
        let expected = ['productName', 'quantity', 'oldStock', 'newStock'];
        const res = await service.adjustProductStock([
          { productId: product.id, quantity: 1 },
        ]);
        expect(Object.keys(res[0])).toEqual(expected);
      });
      it('should not remove and stock and return isOutOfStock', async () => {
        let expected = ['productName', 'isOutOfStock'];
        const res = await service.adjustProductStock([
          { productId: product.id, quantity: 100 },
        ]);
        expect(Object.keys(res[0])).toEqual(expected);
      });
    });
    it('update category for product', async () => {
      await categoryService.registerCategory('Parent 2');
      const [res, error] = await service.updateCategories(
        product.id,
        'PARENT 2',
      );
      expect(error).toBeNull();
      const updatedProduct = await service.getProductById(product.id);
    });
  });
});
