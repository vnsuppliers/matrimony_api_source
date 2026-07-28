import { Test, TestingModule } from '@nestjs/testing';
import { PresentaddressManagementController } from './presentaddress_management.controller';

describe('PresentaddressManagementController', () => {
  let controller: PresentaddressManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentaddressManagementController],
    }).compile();

    controller = module.get<PresentaddressManagementController>(PresentaddressManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
