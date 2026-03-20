import { PrismaClient } from '@generated/prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { DefaultArgs } from '@prisma/client/runtime/client';
import sql from 'mssql';
import { ConfigService } from './ConfigService/Config.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(readonly configService: ConfigService) {
    const config: sql.config = {
      server: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      database: configService.get('DB_NAME'),
      user: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      connectionTimeout: configService.get('DB_TIMEOUT'),
      requestTimeout: configService.get('DB_TIMEOUT'),
      pool: {
        min: configService.get('DB_POOL_MIN_CONNECTIONS'),
        max: configService.get('DB_POOL_MAX_CONNECTIONS'),
        idleTimeoutMillis: configService.get('DB_TIMEOUT'),
      },
      options: {
        encrypt: configService.get('DB_ENCRYPT'),
        trustedConnection: configService.get('DB_TRUST_CONNECTION'),
        trustServerCertificate: configService.get(
          'DB_TRUST_SERVER_CERTIFICATE',
        ),
      },
    };
    const adapter = new PrismaMssql(config);
    super({
      adapter,
      log:
        configService.get('NODE_ENV') === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onModuleInit() {
    await this.$connect();
  }
}

export type TX = Omit<
  PrismaClient<never, undefined, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$use' | '$extends'
>;
