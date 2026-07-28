import { Test, TestingModule } from '@nestjs/testing';
import { SpecialisationController } from './specialisation.controller';

describe('SpecialisationController', () => {
  let controller: SpecialisationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialisationController],
    }).compile();

    controller = module.get<SpecialisationController>(SpecialisationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
