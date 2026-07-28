import { Test, TestingModule } from '@nestjs/testing';
import { MatchedProfilesController } from './matched_profiles.controller';

describe('MatchedProfilesController', () => {
  let controller: MatchedProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchedProfilesController],
    }).compile();

    controller = module.get<MatchedProfilesController>(MatchedProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
