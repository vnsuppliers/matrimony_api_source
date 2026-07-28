import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionInfoController } from './profession_info.controller';

describe('ProfessionInfoController', () => {
  let controller: ProfessionInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionInfoController],
    }).compile();

    controller = module.get<ProfessionInfoController>(ProfessionInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
