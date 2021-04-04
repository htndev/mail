import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../common/providers/config/config.module';
import { MailerModule } from '../common/providers/mailer/mailer.module';
import { TemplateService } from '../common/providers/template/template.service';
import { UserRepository } from '../repositories/user.repository';
import { AmqpConfig } from '../common/providers/config/amqp.config';
import { ConfirmAccountSubscription } from './confirm-account.subscription';
import { ForgotPasswordSubscription } from './forgot-password.subscription';

@Module({
  imports: [
    MailerModule,
    TypeOrmModule.forFeature([UserRepository]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [AmqpConfig],
      useFactory: ({ amqpUrl: uri }: AmqpConfig) => ({ uri, prefetchCount: 1 })
    })
  ],
  providers: [ConfirmAccountSubscription, ForgotPasswordSubscription, TemplateService],
  exports: [ConfirmAccountSubscription]
})
export class SubscriptionModule {}
