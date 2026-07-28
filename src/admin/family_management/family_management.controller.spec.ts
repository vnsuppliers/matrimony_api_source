import { Test, TestingModule } from '@nestjs/testing';
import { FamilyManagementController } from './family_management.controller';

describe('FamilyManagementController', () => {
  let controller: FamilyManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FamilyManagementController],
    }).compile();

    controller = module.get<FamilyManagementController>(FamilyManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
