import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesManagementService } from './hobbies_management.service';

describe('HobbiesManagementService', () => {
  let service: HobbiesManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HobbiesManagementService],
    }).compile();

    service = module.get<HobbiesManagementService>(HobbiesManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
