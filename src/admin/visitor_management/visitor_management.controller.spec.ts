import { Test, TestingModule } from '@nestjs/testing';
import { VisitorManagementController } from './visitor_management.controller';

describe('VisitorManagementController', () => {
  let controller: VisitorManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisitorManagementController],
    }).compile();

    controller = module.get<VisitorManagementController>(VisitorManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
