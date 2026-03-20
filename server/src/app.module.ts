import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './features/auth/Auth.module';
import { JwtAuthGuard } from './features/auth/guards/Auth.guard';
import { CartModule } from './features/cart/Cart.module';
import { CustomerModule } from './features/customers/Customer.module';
import { OrdersModule } from './features/orders/Orders.module';
import { ProductsModule } from './features/products/Products.module';
import { HealthController } from './health.controller';
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
    CartModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
