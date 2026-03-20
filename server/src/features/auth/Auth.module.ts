import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './Auth.controller';
import { LoginUserCommandHandler } from './commands/LoginUser/LoginUserCommandHandler';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [LoginUserCommandHandler, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
