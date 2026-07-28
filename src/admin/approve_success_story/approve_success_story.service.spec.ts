import { Test, TestingModule } from '@nestjs/testing';
import { ApproveSuccessStoryService } from './approve_success_story.service';

describe('ApproveSuccessStoryService', () => {
  let service: ApproveSuccessStoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApproveSuccessStoryService],
    }).compile();

    service = module.get<ApproveSuccessStoryService>(ApproveSuccessStoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
