import { CreateCategoriesDto } from 'src/categories/dto/create-catalog.dto';

export const createCategoriesDtoStub = (): CreateCategoriesDto => {
  return {
    name: 'name',
    parentName: 'parentName',
  };
};
