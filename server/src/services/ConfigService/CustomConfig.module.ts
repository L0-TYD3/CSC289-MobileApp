import { DynamicModule, Global } from '@nestjs/common';
import { configSchema } from './Config.schema';
import { CONFIG_TOKEN, ConfigService } from './Config.service';

@Global()
export class CustomConfigModule {
  static async forRoot(options: {
    schema: typeof configSchema;
    envFile?: string;
  }): Promise<DynamicModule> {
    return {
      module: CustomConfigModule,
      providers: [
        {
          provide: CONFIG_TOKEN,
          useValue: options.schema,
        },
        {
          provide: ConfigService,
          useFactory: (schema: typeof configSchema) =>
            new ConfigService(schema, options.envFile),
          inject: [CONFIG_TOKEN],
        },
      ],
      exports: [ConfigService],
    };
  }
}
