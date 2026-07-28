import { Test, TestingModule } from '@nestjs/testing';
import { HobbiesInfoController } from './hobbies_info.controller';

describe('HobbiesInfoController', () => {
  let controller: HobbiesInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HobbiesInfoController],
    }).compile();

    controller = module.get<HobbiesInfoController>(HobbiesInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
