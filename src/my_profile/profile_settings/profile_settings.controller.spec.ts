import { Test, TestingModule } from '@nestjs/testing';
import { ProfileSettingsController } from './profile_settings.controller';

describe('ProfileSettingsController', () => {
  let controller: ProfileSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileSettingsController],
    }).compile();

    controller = module.get<ProfileSettingsController>(ProfileSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
