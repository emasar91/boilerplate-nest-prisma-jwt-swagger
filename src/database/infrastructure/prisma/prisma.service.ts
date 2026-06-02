import {
  Injectable,
  Inject,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { APP_CONFIG_TOKEN } from '@/config/envs';
import type { AppConfig } from '@/config/envs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  logger = new Logger('Database');

  constructor(@Inject(APP_CONFIG_TOKEN) private readonly config: AppConfig) {
    super({
      adapter: new PrismaPg(config.databaseUrl),
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connected successfully via Global Token');
    } catch (error) {
      this.logger.error('Error connecting to the database:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.warn('Database connection closed');
  }
}
