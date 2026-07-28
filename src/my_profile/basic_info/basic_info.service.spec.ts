import { Test, TestingModule } from '@nestjs/testing';
import { BasicInfoService } from './basic_info.service';

describe('BasicInfoService', () => {
  let service: BasicInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicInfoService],
    }).compile();

    service = module.get<BasicInfoService>(BasicInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
