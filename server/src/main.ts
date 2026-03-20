import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useCorsOptions } from './configs/useCorsOptions';
import { useGlobalFilters } from './configs/useCreateGlobalFilters';
import { useGlobalInterceptors } from './configs/useGlobalInterceptors';
import { useOpenApiConfig } from './configs/useOpenApiConfig';
import { useValidationPipes } from './configs/useValidationPipes';
import { ConfigService } from './services/ConfigService/Config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  useGlobalInterceptors(app);
  app.enableCors(useCorsOptions());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(useValidationPipes());
  useOpenApiConfig(configService, app);
  useGlobalFilters(app);
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API URL: ${configService.get('API_URL')}`);
    console.log(`Swagger URL: ${configService.get('API_URL')}/api/swagger`);
  });
}
bootstrap();
