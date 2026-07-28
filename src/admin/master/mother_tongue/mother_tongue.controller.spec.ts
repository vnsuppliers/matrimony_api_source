import { Test, TestingModule } from '@nestjs/testing';
import { MotherTongueController } from './mother_tongue.controller';

describe('MotherTongueController', () => {
  let controller: MotherTongueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotherTongueController],
    }).compile();

    controller = module.get<MotherTongueController>(MotherTongueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
