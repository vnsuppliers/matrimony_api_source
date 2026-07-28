import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesInfoService } from './hobbies_info.service';

describe('HobbiesInfoService', () => {
  let service: HobbiesInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HobbiesInfoService],
    }).compile();

    service = module.get<HobbiesInfoService>(HobbiesInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
