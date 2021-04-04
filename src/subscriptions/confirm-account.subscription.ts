import { AmqpConnection, MessageOptions, Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AmqpConfig } from '../common/providers/config/amqp.config';
import { I18nService } from '../common/providers/i18n/i18n.service';
import { MailerService } from '../common/providers/mailer/mailer.service';
import { TemplateService } from '../common/providers/template/template.service';
import { EmailType } from '../common/types/email.type';
import { amqpErrorHandler } from '../common/utils/amqp-error-handler.util';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { BaseSubscription } from './base.subscription';

@Injectable()
export class ConfirmAccountSubscription implements BaseSubscription {
  constructor(
    private readonly mailerService: MailerService,
    private readonly i18n: I18nService,
    private readonly templateService: TemplateService,
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    private readonly amqpConnection: AmqpConnection
  ) {}

  @RabbitSubscribe({
    exchange: AmqpConfig.exchange,
    routingKey: `${AmqpConfig.queue.mailer}.confirmAccount`,
    errorHandler: amqpErrorHandler,
    queueOptions: {
      durable: true,
      exclusive: true
    }
  })
  async handler({ email, lang, url, uuid }: { email: string; lang: string; url: string; uuid: string }) {
    const user = (await this.userRepository.findByEmail(email)) ?? ({} as User);
    const confirmationEmail = (await user.emails).find(
      email => email.type === EmailType.ConfirmEmail && email.isActive
    );

    if (confirmationEmail) {
      confirmationEmail.isActive = false;
      await confirmationEmail.save();
    }
    const body = await this.templateService.getTemplate(EmailType.ConfirmEmail, lang, {
      username: email,
      headerTitle: this.i18n.t('sign-up.header-title', lang),
      greet: this.i18n.t('greet', lang, { username: user.username }),
      fewSeconds: this.i18n.t('sign-up.few-seconds', lang),
      lastStep: this.i18n.t('sign-up.last-step', lang),
      confirmEmail: this.i18n.t('sign-up.confirm-email', lang),
      url
    });

    try {
      this.mailerService.sendMail({
        to: email,
        subject: this.i18n.t('sign-up.subject', lang, [user.username]),
        body,
        type: EmailType.ConfirmEmail,
        user,
        uuid
      });
      return new Nack();
    } catch (e) {
      return new Nack(true);
    }
  }
}
