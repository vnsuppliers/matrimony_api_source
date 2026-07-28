import { Test, TestingModule } from '@nestjs/testing';
import { FamilyManagementService } from './family_management.service';

describe('FamilyManagementService', () => {
  let service: FamilyManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamilyManagementService],
    }).compile();

    service = module.get<FamilyManagementService>(FamilyManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
