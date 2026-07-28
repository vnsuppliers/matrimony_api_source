import { Test, TestingModule } from '@nestjs/testing';
import { SuccessStoryService } from './success_story.service';

describe('SuccessStoryService', () => {
  let service: SuccessStoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuccessStoryService],
    }).compile();

    service = module.get<SuccessStoryService>(SuccessStoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
