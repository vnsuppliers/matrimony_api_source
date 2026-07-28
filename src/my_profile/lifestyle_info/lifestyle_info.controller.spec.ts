import { Test, TestingModule } from '@nestjs/testing';
import { LifestyleInfoController } from './lifestyle_info.controller';

describe('LifestyleInfoController', () => {
  let controller: LifestyleInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifestyleInfoController],
    }).compile();

    controller = module.get<LifestyleInfoController>(LifestyleInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
