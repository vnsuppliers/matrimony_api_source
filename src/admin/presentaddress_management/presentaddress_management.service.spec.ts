import { Test, TestingModule } from '@nestjs/testing';
import { PresentaddressManagementService } from './presentaddress_management.service';

describe('PresentaddressManagementService', () => {
  let service: PresentaddressManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentaddressManagementService],
    }).compile();

    service = module.get<PresentaddressManagementService>(PresentaddressManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
