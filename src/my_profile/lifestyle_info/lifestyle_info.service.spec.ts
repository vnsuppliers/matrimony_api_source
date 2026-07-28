import { Test, TestingModule } from '@nestjs/testing';
import { LifestyleInfoService } from './lifestyle_info.service';

describe('LifestyleInfoService', () => {
  let service: LifestyleInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifestyleInfoService],
    }).compile();

    service = module.get<LifestyleInfoService>(LifestyleInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
