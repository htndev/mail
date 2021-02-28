import { Module } from '@nestjs/common';
import { AppConfig, DatabaseConfig } from '@xbeat/server-toolkit';
import { AmqpConfig } from './amqp.config';
import { EmailConfig } from './email.config';

const CONFIGS = [AppConfig, AmqpConfig, DatabaseConfig, EmailConfig];

@Module({
  providers: CONFIGS,
  exports: CONFIGS
})
export class ConfigModule {}
