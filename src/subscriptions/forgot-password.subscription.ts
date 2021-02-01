import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

import { AmqpConfig } from '../common/providers/config/amqp.config';
import { amqpErrorHandler } from '../common/utils/amqp-error-handler.util';
import { BaseSubscription } from './base.subscription';

@Injectable()
export class ForgotPasswordSubscription implements BaseSubscription {
  @RabbitSubscribe({
    exchange: AmqpConfig.exchange,
    // queue: AmqpConfig.queue.mailer + '1',
    routingKey: `${AmqpConfig.queue.mailer}.forgotPassword`,
    errorHandler: amqpErrorHandler,
    queueOptions: {
      durable: true,
      exclusive: true
    }
  })
  handler(obj: any): void {
    console.log('forgotPassword');
  }
}
