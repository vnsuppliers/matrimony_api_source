import { Test, TestingModule } from '@nestjs/testing';
import { PermanentaddressManagementController } from './permanentaddress_management.controller';

describe('PermanentaddressManagementController', () => {
  let controller: PermanentaddressManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermanentaddressManagementController],
    }).compile();

    controller = module.get<PermanentaddressManagementController>(PermanentaddressManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
