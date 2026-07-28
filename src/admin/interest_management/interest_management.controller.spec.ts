import { Test, TestingModule } from '@nestjs/testing';
import { InterestManagementController } from './interest_management.controller';

describe('InterestManagementController', () => {
  let controller: InterestManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestManagementController],
    }).compile();

    controller = module.get<InterestManagementController>(InterestManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
