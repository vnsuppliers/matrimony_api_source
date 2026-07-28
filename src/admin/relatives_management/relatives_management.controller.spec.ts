import { Test, TestingModule } from '@nestjs/testing';
import { RelativesManagementController } from './relatives_management.controller';

describe('RelativesManagementController', () => {
  let controller: RelativesManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelativesManagementController],
    }).compile();

    controller = module.get<RelativesManagementController>(RelativesManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
