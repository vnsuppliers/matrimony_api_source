import { Test, TestingModule } from '@nestjs/testing';
import { BlockManagementController } from './block_management.controller';

describe('BlockManagementController', () => {
  let controller: BlockManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockManagementController],
    }).compile();

    controller = module.get<BlockManagementController>(BlockManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
