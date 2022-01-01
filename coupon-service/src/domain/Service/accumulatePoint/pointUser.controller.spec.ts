import { Test, TestingModule } from '@nestjs/testing';

import { PointUserController } from './pointUser.controller';

describe("PointUserController", () => {
  let pointUserController: PointUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointUserController],
    }).compile();

    pointUserController = module.get<PointUserController>(PointUserController);
  });
});
