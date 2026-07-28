import { Test, TestingModule } from '@nestjs/testing';
import { SiblingsInfoService } from './siblings_info.service';

describe('SiblingsInfoService', () => {
  let service: SiblingsInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiblingsInfoService],
    }).compile();

    service = module.get<SiblingsInfoService>(SiblingsInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
