import { Test, TestingModule } from '@nestjs/testing';
import { ReportProfilesService } from './report_profiles.service';

describe('ReportProfilesService', () => {
  let service: ReportProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportProfilesService],
    }).compile();

    service = module.get<ReportProfilesService>(ReportProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
