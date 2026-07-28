import { Test, TestingModule } from '@nestjs/testing';
import { DesignationMasterController } from './designation_master.controller';

describe('DesignationMasterController', () => {
  let controller: DesignationMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesignationMasterController],
    }).compile();

    controller = module.get<DesignationMasterController>(DesignationMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
