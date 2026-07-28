import { Test, TestingModule } from '@nestjs/testing';
import { AddToBookmarksService } from './add_to_bookmarks.service';

describe('AddToBookmarksService', () => {
  let service: AddToBookmarksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddToBookmarksService],
    }).compile();

    service = module.get<AddToBookmarksService>(AddToBookmarksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
