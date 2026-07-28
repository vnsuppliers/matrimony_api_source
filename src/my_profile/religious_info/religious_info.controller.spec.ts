import { Test, TestingModule } from '@nestjs/testing';
import { ReligiousInfoController } from './religious_info.controller';

describe('ReligiousInfoController', () => {
  let controller: ReligiousInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReligiousInfoController],
    }).compile();

    controller = module.get<ReligiousInfoController>(ReligiousInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
