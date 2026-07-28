import { Test, TestingModule } from '@nestjs/testing';
import { ShortlistManagementController } from './shortlist_management.controller';

describe('ShortlistManagementController', () => {
  let controller: ShortlistManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortlistManagementController],
    }).compile();

    controller = module.get<ShortlistManagementController>(ShortlistManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
