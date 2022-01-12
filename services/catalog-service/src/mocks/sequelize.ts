 const Sequelize = jest.fn().mockReturnValue({
  query: jest.fn().mockResolvedValue({ result: 'ok', code: 200 }),
});
export default Sequelize();