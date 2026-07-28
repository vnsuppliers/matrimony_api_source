import { Test, TestingModule } from '@nestjs/testing';
import { AddToWhislistService } from './add_to_whislist.service';

describe('AddToWhislistService', () => {
  let service: AddToWhislistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddToWhislistService],
    }).compile();

    service = module.get<AddToWhislistService>(AddToWhislistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
