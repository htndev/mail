import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { DatabaseType } from 'typeorm';

import { BaseConfig } from './base.config';

interface DatabaseConfigProps {
  DB_TYPE: DatabaseType;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_LOGGING: boolean;
  DB_SYNCHRONIZE: boolean;
  DB_CONNECTION_RETRY_ATTEMPTS: number;
}

@Injectable()
export class DatabaseConfig extends BaseConfig<DatabaseConfigProps> {
  getSchema(): Joi.ObjectSchema {
    return Joi.object().append({
      DB_TYPE: Joi.string().default('postgres'),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_HOST: Joi.string().required(),
      DB_PORT: Joi.number().required(),
      DB_NAME: Joi.string().required(),
      DB_LOGGING: Joi.boolean().default(true),
      DB_SYNCHRONIZE: Joi.boolean().required(),
      DB_CONNECTION_RETRY_ATTEMPTS: Joi.number().default(5)
    });
  }

  get type(): DatabaseType {
    return this.config.DB_TYPE;
  }

  get host(): string {
    return this.config.DB_HOST;
  }

  get port(): number {
    return this.config.DB_PORT;
  }

  get username(): string {
    return this.config.DB_USERNAME;
  }

  get password(): string {
    return this.config.DB_PASSWORD;
  }

  get database(): string {
    return this.config.DB_NAME;
  }

  get logging(): boolean {
    return this.config.DB_LOGGING;
  }

  get synchronize(): boolean {
    return this.config.DB_SYNCHRONIZE;
  }

  get dbConnectionRetryAttempts(): number {
    return this.config.DB_CONNECTION_RETRY_ATTEMPTS;
  }
}
