import { Test, TestingModule } from '@nestjs/testing';
import { ShortlistManagementService } from './shortlist_management.service';

describe('ShortlistManagementService', () => {
  let service: ShortlistManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShortlistManagementService],
    }).compile();

    service = module.get<ShortlistManagementService>(ShortlistManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
