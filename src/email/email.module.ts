import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplateEntity } from 'src/entities/email_template.entity';
import { SettingsEntity } from 'src/entities/settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplateEntity, SettingsEntity])],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
