import { ConfigService } from '@/services/ConfigService/Config.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  INestApplication,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const useOpenApiConfig = (
  configService: ConfigService,
  app: INestApplication,
) => {
  const isDev = configService.get('NODE_ENV') === 'development';
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CSC Capstone API')
    .setDescription('CSC Capstone API Documentation')
    .setVersion(process.env.VERSION ?? '1.0.0')
    .addGlobalResponse({
      type: BadRequestException,
      status: HttpStatus.BAD_REQUEST,
    })
    .addGlobalResponse({
      type: UnauthorizedException,
      status: HttpStatus.UNAUTHORIZED,
    })
    .addGlobalResponse({
      type: ForbiddenException,
      status: HttpStatus.FORBIDDEN,
    })
    .addGlobalResponse({
      type: NotFoundException,
      status: HttpStatus.NOT_FOUND,
    })
    .addGlobalResponse({
      type: ConflictException,
      status: HttpStatus.CONFLICT,
    })
    .addGlobalResponse({
      type: InternalServerErrorException,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    })
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);

  if (isDev) {
    SwaggerModule.setup('/api/swagger', app, documentFactory, {
      jsonDocumentUrl: '/api/swagger/json',
    });
  }
};
