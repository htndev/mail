import { MessageErrorHandler } from '@golevelup/nestjs-rabbitmq';
import { Logger } from '@nestjs/common';

const logger = new Logger('AMQP');

export const amqpErrorHandler: MessageErrorHandler = (channel, msg, error): void => {
  logger.error(
    `MessageErrorHandler ${msg.fields.exchange} -> ${msg.fields.routingKey};` +
      `message ${msg.content.toString()}; error: ${error.message};`
  );

  channel.nack(msg, true, false);
};
