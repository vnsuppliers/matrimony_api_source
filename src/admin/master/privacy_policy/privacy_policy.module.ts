import { Module } from '@nestjs/common';
import { PrivacyPolicyService } from './privacy_policy.service';
import { PrivacyPolicyController } from './privacy_policy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivacyPolicyEntity } from 'src/entities/privacy_policy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrivacyPolicyEntity])],
  providers: [PrivacyPolicyService],
  controllers: [PrivacyPolicyController],
})
export class PrivacyPolicyModule {}
