import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalController } from './physical.controller';

describe('PhysicalController', () => {
  let controller: PhysicalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhysicalController],
    }).compile();

    controller = module.get<PhysicalController>(PhysicalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
