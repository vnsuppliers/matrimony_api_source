import { Test, TestingModule } from '@nestjs/testing';
import { PresentAddressController } from './present_address.controller';

describe('PresentAddressController', () => {
  let controller: PresentAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentAddressController],
    }).compile();

    controller = module.get<PresentAddressController>(PresentAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
