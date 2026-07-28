import { Test, TestingModule } from '@nestjs/testing';
import { ReportManagementService } from './report_management.service';

describe('ReportManagementService', () => {
  let service: ReportManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportManagementService],
    }).compile();

    service = module.get<ReportManagementService>(ReportManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
