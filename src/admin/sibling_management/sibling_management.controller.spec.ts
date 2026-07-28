import { Test, TestingModule } from '@nestjs/testing';
import { SiblingManagementController } from './sibling_management.controller';

describe('SiblingManagementController', () => {
  let controller: SiblingManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SiblingManagementController],
    }).compile();

    controller = module.get<SiblingManagementController>(SiblingManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
