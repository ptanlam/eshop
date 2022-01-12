import { randomUUID } from 'crypto';
import { CreateProductDto } from '../products/dto/create-product.dto';

const CreateProductDtoStub = (): CreateProductDto => {
  return {
    name: 'test',
    briefDescription: 'test',
    detailDescription: 'test',
    stock: 10,
    price: 100,
    unit: 'VND',
    active: true,
    brandId: randomUUID(),
    categoryId: 'id',
    attributes: [
      { name: 'att product 1', value: '100' },
      { name: 'att product 2', value: '200' },
    ],
  };
};
export default CreateProductDtoStub();
