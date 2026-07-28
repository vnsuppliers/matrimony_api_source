import { Test, TestingModule } from '@nestjs/testing';
import { ReligiousInfoService } from './religious_info.service';

describe('ReligiousInfoService', () => {
  let service: ReligiousInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReligiousInfoService],
    }).compile();

    service = module.get<ReligiousInfoService>(ReligiousInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
