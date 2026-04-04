import { PUBLIC_KEY } from '@/decorators/Public.decorator';
import { ConfigService } from '@/services/ConfigService/Config.service';
import { getRequest } from '@/utils/getRequest';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard that validates the API key for the webhooks endpoint.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = getRequest(context);

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const apiKey = request.headers['x-api-key'];

    if (!apiKey || apiKey !== this.configService.get('WEBHOOK_API_KEY'))
      throw new UnauthorizedException('Api key is not valid');

    return true;
  }
}
