import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule as EnvModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseConfig, NodeEnvironment } from '@xbeat/server-toolkit';
import { join } from 'path';

import { AmqpConfig } from './common/providers/config/amqp.config';
import { ConfigModule } from './common/providers/config/config.module';
import { I18nModule } from './common/providers/i18n/i18n.module';
import { SubscriptionModule } from './subscriptions/subscription.module';

@Module({
  imports: [
    EnvModule.forRoot({
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === NodeEnvironment.PRODUCTION
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [DatabaseConfig],
      useFactory: ({
        type,
        host,
        username,
        password,
        database,
        synchronize,
        logging,
        port,
        dbConnectionRetryAttempts: retryAttempts
      }: DatabaseConfig) =>
        ({
          type,
          host,
          port,
          username,
          password,
          database,
          synchronize,
          logging,
          retryAttempts,
          entities: [`${__dirname}/entities/*.entity.{ts,js}`]
        } as TypeOrmModuleOptions)
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [AmqpConfig],
      useFactory: ({ amqpUrl: uri }: AmqpConfig) => ({ uri, prefetchCount: 1 })
    }),
    I18nModule.forRoot({
      folder: join(__dirname, 'i18n'),
      fallbackLanguage: 'en'
    }),
    SubscriptionModule
  ]
})
export class AppModule {}
