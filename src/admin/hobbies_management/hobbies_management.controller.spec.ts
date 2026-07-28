import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesManagementController } from './hobbies_management.controller';

describe('HobbiesManagementController', () => {
  let controller: HobbiesManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HobbiesManagementController],
    }).compile();

    controller = module.get<HobbiesManagementController>(HobbiesManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
