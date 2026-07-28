import { Test, TestingModule } from '@nestjs/testing';
import { ProfileVisitorsService } from './profile_visitors.service';

describe('ProfileVisitorsService', () => {
  let service: ProfileVisitorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileVisitorsService],
    }).compile();

    service = module.get<ProfileVisitorsService>(ProfileVisitorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
