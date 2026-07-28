import { Test, TestingModule } from '@nestjs/testing';
import { PermanentAddressService } from './permanent_address.service';

describe('PermanentAddressService', () => {
  let service: PermanentAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermanentAddressService],
    }).compile();

    service = module.get<PermanentAddressService>(PermanentAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
