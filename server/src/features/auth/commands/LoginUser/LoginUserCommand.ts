import { Command } from '@nestjs/cqrs';
import { IsEmail } from 'class-validator';

export class LoginUserCommandRequestDto {
  @IsEmail()
  email: string;
}
export class LoginUserCommand extends Command<string> {
  constructor(public readonly dto: LoginUserCommandRequestDto) {
    super();
  }
}
