import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './features/auth/Auth.module';
import { JwtAuthGuard } from './features/auth/guards/Auth.guard';
import { CustomerModule } from './features/customers/Customer.module';
import { configSchema } from './services/ConfigService/Config.schema';
import { CustomConfigModule } from './services/ConfigService/CustomConfig.module';
import { GlobalServicesModule } from './services/GlobalServices.module';

@Module({
  imports: [
    CustomConfigModule.forRoot({
      schema: configSchema,
    }),
    CqrsModule.forRoot(),
    GlobalServicesModule,
    AuthModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
