import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';

import { BaseConfig } from './base.config';

interface AppConfigProps {
  PORT: number;
  APP_HOSTNAME: string;
}

@Injectable()
export class AppConfig extends BaseConfig<AppConfigProps> {
  getSchema(): Joi.ObjectSchema {
    return Joi.object({
      PORT: Joi.number().required(),
      APP_HOSTNAME: Joi.string().required()
    });
  }

  get port(): number {
    return this.config.PORT;
  }

  get appHostname(): string {
    return this.config.APP_HOSTNAME;
  }

  get isLocalhost(): boolean {
    return this.appHostname.includes('localhost');
  }

  get url(): string {
    const port = this.isLocalhost ? `:${this.port}` : '';

    return `http://${this.appHostname}${port}`;
  }
}
