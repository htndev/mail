import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppConfig } from '@xbeat/server-toolkit';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);

  logger.verbose(`Server launched on port ${config.port}`);
  await app.listen(config.port);
}
bootstrap();
