import { Test, TestingModule } from '@nestjs/testing';
import { PermanentaddressManagementService } from './permanentaddress_management.service';

describe('PermanentaddressManagementService', () => {
  let service: PermanentaddressManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermanentaddressManagementService],
    }).compile();

    service = module.get<PermanentaddressManagementService>(PermanentaddressManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
