import { Test, TestingModule } from '@nestjs/testing';
import { RelativesInfoService } from './relatives_info.service';

describe('RelativesInfoService', () => {
  let service: RelativesInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelativesInfoService],
    }).compile();

    service = module.get<RelativesInfoService>(RelativesInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
