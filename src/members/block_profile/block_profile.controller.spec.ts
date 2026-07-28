import { Test, TestingModule } from '@nestjs/testing';
import { BlockProfileController } from './block_profile.controller';

describe('BlockProfileController', () => {
  let controller: BlockProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockProfileController],
    }).compile();

    controller = module.get<BlockProfileController>(BlockProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
