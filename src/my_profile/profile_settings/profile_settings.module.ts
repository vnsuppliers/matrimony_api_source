import { Module } from '@nestjs/common';
import { ProfileSettingsService } from './profile_settings.service';
import { ProfileSettingsController } from './profile_settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MemberEntity } from 'src/entities/member.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, MemberEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [ProfileSettingsService],
  controllers: [ProfileSettingsController],
})
export class ProfileSettingsModule {}
