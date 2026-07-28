import { Test, TestingModule } from '@nestjs/testing';
import { MatchedProfilesService } from './matched_profiles.service';

describe('MatchedProfilesService', () => {
  let service: MatchedProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchedProfilesService],
    }).compile();

    service = module.get<MatchedProfilesService>(MatchedProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
