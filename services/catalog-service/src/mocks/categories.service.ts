const CategoriesService = jest.fn().mockReturnValue({
  registerCategory: jest.fn().mockReturnValue({
    name: 'Category 1',
  }),
  countProductByCategory: jest.fn().mockReturnValue({ count: 10 }),
  getProductsByCategoryId: jest
    .fn()
    .mockReturnValue([[{ name: 'Category 1' }], null]),
  getNameFilter: jest.fn().mockResolvedValue([
    {
      name: 'Category 1',
    },
  ]),
  getAllCategories: jest
    .fn()
    .mockResolvedValue([
      [{ id: '', name: 'Category 1', images: [], children: [] }],
      null,
    ]),
});
export default CategoriesService();
