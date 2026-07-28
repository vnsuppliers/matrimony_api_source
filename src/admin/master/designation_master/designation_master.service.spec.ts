import { Test, TestingModule } from '@nestjs/testing';
import { DesignationMasterService } from './designation_master.service';

describe('DesignationMasterService', () => {
  let service: DesignationMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesignationMasterService],
    }).compile();

    service = module.get<DesignationMasterService>(DesignationMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
