import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';
import { EmailRepository } from '../../../repositories/email.repository';
import { MailerService } from './mailer.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([EmailRepository])],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
