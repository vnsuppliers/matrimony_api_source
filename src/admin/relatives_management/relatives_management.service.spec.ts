import { Test, TestingModule } from '@nestjs/testing';
import { RelativesManagementService } from './relatives_management.service';

describe('RelativesManagementService', () => {
  let service: RelativesManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelativesManagementService],
    }).compile();

    service = module.get<RelativesManagementService>(RelativesManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
