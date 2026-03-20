import { Global, Module } from '@nestjs/common';
import { AppLogger } from './AppLogger.service';
import { PrismaService } from './Prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService, AppLogger],
})
export class GlobalServicesModule {}
