import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionMasterController } from './profession_master.controller';

describe('ProfessionMasterController', () => {
  let controller: ProfessionMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionMasterController],
    }).compile();

    controller = module.get<ProfessionMasterController>(ProfessionMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
