import { Test, TestingModule } from '@nestjs/testing';
import { ApproveSuccessStoryController } from './approve_success_story.controller';

describe('ApproveSuccessStoryController', () => {
  let controller: ApproveSuccessStoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApproveSuccessStoryController],
    }).compile();

    controller = module.get<ApproveSuccessStoryController>(ApproveSuccessStoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
