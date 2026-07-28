import { Test, TestingModule } from '@nestjs/testing';
import { ProfileSettingsService } from './profile_settings.service';

describe('ProfileSettingsService', () => {
  let service: ProfileSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileSettingsService],
    }).compile();

    service = module.get<ProfileSettingsService>(ProfileSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
