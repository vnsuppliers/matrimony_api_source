import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionMasterService } from './profession_master.service';

describe('ProfessionMasterService', () => {
  let service: ProfessionMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionMasterService],
    }).compile();

    service = module.get<ProfessionMasterService>(ProfessionMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
