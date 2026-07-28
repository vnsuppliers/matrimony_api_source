import { Test, TestingModule } from '@nestjs/testing';
import { InterestManagementService } from './interest_management.service';

describe('InterestManagementService', () => {
  let service: InterestManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterestManagementService],
    }).compile();

    service = module.get<InterestManagementService>(InterestManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
