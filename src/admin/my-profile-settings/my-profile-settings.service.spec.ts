import { Test, TestingModule } from '@nestjs/testing';
import { MyProfileSettingsService } from './my-profile-settings.service';

describe('MyProfileSettingsService', () => {
  let service: MyProfileSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyProfileSettingsService],
    }).compile();

    service = module.get<MyProfileSettingsService>(MyProfileSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
