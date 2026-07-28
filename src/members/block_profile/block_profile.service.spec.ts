import { Test, TestingModule } from '@nestjs/testing';
import { BlockProfileService } from './block_profile.service';

describe('BlockProfileService', () => {
  let service: BlockProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockProfileService],
    }).compile();

    service = module.get<BlockProfileService>(BlockProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
