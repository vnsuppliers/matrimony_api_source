import { Test, TestingModule } from '@nestjs/testing';
import { AddToWhislistController } from './add_to_whislist.controller';

describe('AddToWhislistController', () => {
  let controller: AddToWhislistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddToWhislistController],
    }).compile();

    controller = module.get<AddToWhislistController>(AddToWhislistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
