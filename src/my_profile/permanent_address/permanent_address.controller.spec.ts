import { Test, TestingModule } from '@nestjs/testing';
import { PermanentAddressController } from './permanent_address.controller';

describe('PermanentAddressController', () => {
  let controller: PermanentAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermanentAddressController],
    }).compile();

    controller = module.get<PermanentAddressController>(PermanentAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
