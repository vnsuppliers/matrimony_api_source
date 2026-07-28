import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionInfoService } from './profession_info.service';

describe('ProfessionInfoService', () => {
  let service: ProfessionInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessionInfoService],
    }).compile();

    service = module.get<ProfessionInfoService>(ProfessionInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
