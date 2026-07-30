import { Test, TestingModule } from '@nestjs/testing';
import { MyProfileSettingsController } from './my-profile-settings.controller';

describe('MyProfileSettingsController', () => {
  let controller: MyProfileSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyProfileSettingsController],
    }).compile();

    controller = module.get<MyProfileSettingsController>(MyProfileSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
