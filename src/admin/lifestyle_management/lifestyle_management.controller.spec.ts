import { Test, TestingModule } from '@nestjs/testing';
import { LifestyleManagementController } from './lifestyle_management.controller';

describe('LifestyleManagementController', () => {
  let controller: LifestyleManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifestyleManagementController],
    }).compile();

    controller = module.get<LifestyleManagementController>(LifestyleManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
