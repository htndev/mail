import { Module } from '@nestjs/common';

import { AmqpConfig } from './amqp.config';
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { EmailConfig } from './email.config';

@Module({
  providers: [AppConfig, AmqpConfig, DatabaseConfig, EmailConfig],
  exports: [AppConfig, AmqpConfig, DatabaseConfig, EmailConfig]
})
export class ConfigModule {}
