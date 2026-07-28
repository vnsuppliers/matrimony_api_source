import { Test, TestingModule } from '@nestjs/testing';
import { LifestyleManagementService } from './lifestyle_management.service';

describe('LifestyleManagementService', () => {
  let service: LifestyleManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifestyleManagementService],
    }).compile();

    service = module.get<LifestyleManagementService>(LifestyleManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
