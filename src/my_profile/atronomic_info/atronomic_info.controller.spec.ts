import { Test, TestingModule } from '@nestjs/testing';
import { AtronomicInfoController } from './atronomic_info.controller';

describe('AtronomicInfoController', () => {
  let controller: AtronomicInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtronomicInfoController],
    }).compile();

    controller = module.get<AtronomicInfoController>(AtronomicInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
