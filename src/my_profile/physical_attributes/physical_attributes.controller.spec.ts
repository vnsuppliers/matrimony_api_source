import { Test, TestingModule } from '@nestjs/testing';
import { PhysicalAttributesController } from './physical_attributes.controller';

describe('PhysicalAttributesController', () => {
  let controller: PhysicalAttributesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhysicalAttributesController],
    }).compile();

    controller = module.get<PhysicalAttributesController>(PhysicalAttributesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
