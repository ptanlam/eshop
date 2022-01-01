import { productStub } from '../stubs/products.stub';

const ProductsService = jest.fn().mockReturnValue({
  adjustStock: jest.fn().mockResolvedValue({
    status: 200,
    message: 'Adjustment successfully',
    data: {
      oldStock: productStub().stock,
      adjustAmount: 1,
      newStock: productStub().stock - 1,
    },
  }),
  getProductById: jest.fn().mockResolvedValue([[productStub()], '']),
});

export default ProductsService();
