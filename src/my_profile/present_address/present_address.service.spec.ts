import { Test, TestingModule } from '@nestjs/testing';
import { PresentAddressService } from './present_address.service';

describe('PresentAddressService', () => {
  let service: PresentAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentAddressService],
    }).compile();

    service = module.get<PresentAddressService>(PresentAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
