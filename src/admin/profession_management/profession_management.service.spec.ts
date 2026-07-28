import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionManagementService } from './profession_management.service';

describe('ProfessionManagementService', () => {
  let service: ProfessionManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionManagementService],
    }).compile();

    service = module.get<ProfessionManagementService>(ProfessionManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
