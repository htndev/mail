import { Injectable } from '@nestjs/common';
import { BaseConfig } from '@xbeat/server-toolkit';
import * as Joi from 'joi';

interface AmqpConfigProps {
  AMQP_URL: string;
}

@Injectable()
export class AmqpConfig extends BaseConfig<AmqpConfigProps> {
  static exchange = 'application';
  static queue = {
    mailer: 'mailer'
  };

  getSchema() {
    return Joi.object({
      AMQP_URL: Joi.string().required()
    });
  }

  get amqpUrl(): string {
    return this.config.AMQP_URL;
  }
}
