import { Test, TestingModule } from '@nestjs/testing';
import { ProfileVisitorsController } from './profile_visitors.controller';

describe('ProfileVisitorsController', () => {
  let controller: ProfileVisitorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileVisitorsController],
    }).compile();

    controller = module.get<ProfileVisitorsController>(ProfileVisitorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
