const MessagingService = jest.fn().mockReturnValue({
  saveFiles: jest.fn().mockReturnValue({}),
});
export default MessagingService();
