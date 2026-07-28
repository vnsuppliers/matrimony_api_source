import { Test, TestingModule } from '@nestjs/testing';
import { EducationInfoService } from './education_info.service';

describe('EducationInfoService', () => {
  let service: EducationInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationInfoService],
    }).compile();

    service = module.get<EducationInfoService>(EducationInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
