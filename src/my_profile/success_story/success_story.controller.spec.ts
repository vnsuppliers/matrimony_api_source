import { Test, TestingModule } from '@nestjs/testing';
import { SuccessStoryController } from './success_story.controller';

describe('SuccessStoryController', () => {
  let controller: SuccessStoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuccessStoryController],
    }).compile();

    controller = module.get<SuccessStoryController>(SuccessStoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
