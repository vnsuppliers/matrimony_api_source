import { Test, TestingModule } from '@nestjs/testing';
import { AtronomicInfoService } from './atronomic_info.service';

describe('AtronomicInfoService', () => {
  let service: AtronomicInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtronomicInfoService],
    }).compile();

    service = module.get<AtronomicInfoService>(AtronomicInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
