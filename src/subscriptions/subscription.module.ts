import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailerModule } from '../common/providers/mailer/mailer.module';
import { TemplateService } from '../common/providers/template/template.service';
import { UserRepository } from '../repositories/user.repository';
import { ConfirmAccountSubscription } from './confirm-account.subscription';
import { ForgotPasswordSubscription } from './forgot-password.subscription';

@Module({
  imports: [MailerModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [ConfirmAccountSubscription, ForgotPasswordSubscription, TemplateService],
  exports: [ConfirmAccountSubscription]
})
export class SubscriptionModule {}
