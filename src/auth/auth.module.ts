import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/entities/user.entity';
import { BasicInfoModule } from 'src/my_profile/basic_info/basic_info.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    BasicInfoModule,
    PassportModule,

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = (config.get('JWT_EXPIRES_IN') ?? '1d') as any;

        return {
          secret: config.get<string>('JWT_SECRET_KEY')!,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),

    TypeOrmModule.forFeature([User]),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
