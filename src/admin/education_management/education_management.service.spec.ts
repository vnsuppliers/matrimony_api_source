import { Test, TestingModule } from '@nestjs/testing';
import { EducationManagementService } from './education_management.service';

describe('EducationManagementService', () => {
  let service: EducationManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationManagementService],
    }).compile();

    service = module.get<EducationManagementService>(EducationManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
