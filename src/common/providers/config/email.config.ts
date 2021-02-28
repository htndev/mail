import { Injectable } from '@nestjs/common';
import { BaseConfig } from '@xbeat/server-toolkit';
import * as Joi from 'joi';

interface EmailConfigProps {
  EMAIL_CLIENT_ID: string;
  EMAIL_CLIENT_SECRET: string;
  EMAIL_REFRESH_TOKEN: string;
  EMAIL_REDIRECT_URL: string;
  EMAIL: string;
}

@Injectable()
export class EmailConfig extends BaseConfig<EmailConfigProps> {
  getSchema() {
    return Joi.object({
      EMAIL_CLIENT_ID: Joi.string().required(),
      EMAIL_CLIENT_SECRET: Joi.string().required(),
      EMAIL_REFRESH_TOKEN: Joi.string().required(),
      EMAIL_REDIRECT_URI: Joi.string().required(),
      EMAIL: Joi.string().required()
    });
  }

  get clientId(): string {
    return this.config.EMAIL_CLIENT_ID;
  }

  get clientSecret(): string {
    return this.config.EMAIL_CLIENT_SECRET;
  }

  get refreshToken(): string {
    return this.config.EMAIL_REFRESH_TOKEN;
  }

  get redirectUri(): string {
    return this.config.EMAIL_REDIRECT_URL;
  }

  get email(): string {
    return this.config.EMAIL;
  }

  get emailTitle(): string {
    return `No reply xBeat <${this.email}>`;
  }
}
