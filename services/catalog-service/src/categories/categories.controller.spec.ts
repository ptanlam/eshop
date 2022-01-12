import { createCategoriesDtoStub } from '../stubs/create-categories.dto.stub';
import FilesService from '../mocks/file.service';
import MessagingService from '../mocks/messaging.service';
import { CategoriesController } from './categories.controller';
import CategoriesService from '../mocks/categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let categoryName = 'Category 1';

  beforeAll(async () => {
    controller = new CategoriesController(
      CategoriesService,
      FilesService,
      MessagingService,
    );
  });
  describe('add categories', () => {
    it('should register categories', async () => {
      const result = await controller.registerCategories(
        createCategoriesDtoStub(),
        {},
      );
      expect(result.name).toEqual(categoryName);
    });
  });

  describe('get categories', () => {
    it('should return categories filtered name', async () => {
      const result = await controller.getNameFilter();
      expect(result[0].name).toEqual(categoryName);
    });

    it('should return all categories', async () => {
      const result = await controller.getAllCategories();
      expect(result[0].name).toEqual(categoryName);
    });
  });
});
