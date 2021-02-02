import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AmqpConfig } from '../common/providers/config/amqp.config';
import { amqpErrorHandler } from '../common/utils/amqp-error-handler.util';
import { I18nService } from '../common/providers/i18n/i18n.service';
import { MailerService } from '../common/providers/mailer/mailer.service';
import { TemplateService } from '../common/providers/template/template.service';
import { EmailType } from '../common/types/email.type';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { BaseSubscription } from './base.subscription';

@Injectable()
export class ForgotPasswordSubscription implements BaseSubscription {
  constructor(
    private readonly mailerService: MailerService,
    private readonly i18n: I18nService,
    private readonly templateService: TemplateService,
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository
  ) {}

  @RabbitSubscribe({
    exchange: AmqpConfig.exchange,
    routingKey: `${AmqpConfig.queue.mailer}.forgotPassword`,
    errorHandler: amqpErrorHandler,
    queueOptions: {
      durable: true,
      exclusive: true
    }
  })
  async handler({ email, lang, url, uuid }: { email: string; lang: string; url: string; uuid: string }): Promise<void> {
    const user = (await this.userRepository.findByEmail(email)) ?? ({} as User);
    const resetPasswordEmail = (await user.emails).find(
      email => email.type === EmailType.ForgotPassword && email.isActive
    );

    if (resetPasswordEmail) {
      resetPasswordEmail.isActive = false;
      await resetPasswordEmail.save();
    }
    const i18nScope = 'password-recover';

    const body = await this.templateService.getTemplate(EmailType.ForgotPassword, lang, {
      headerTitle: this.i18n.t(`${i18nScope}.header-title`, lang),
      greet: this.i18n.t('greet', lang, { username: user.username }),
      instruction: this.i18n.t(`${i18nScope}.instruction`, lang),
      warning: this.i18n.t(`${i18nScope}.warning`, lang),
      reset: this.i18n.t(`${i18nScope}.reset`, lang),
      url
    });

    this.mailerService.sendMail({
      to: email,
      subject: this.i18n.t(`${i18nScope}.subject`, lang, [user.username]),
      body,
      type: EmailType.ForgotPassword,
      user,
      uuid
    });
  }
}
