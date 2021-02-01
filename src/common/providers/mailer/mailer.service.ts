import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { createTransport } from 'nodemailer';
import { v4 as uuidGenerator } from 'uuid';

import { Email } from '../../types/email.type';
import { EmailConfig } from '../config/email.config';
import { EmailRepository } from './../../../repositories/email.repository';

const { OAuth2 } = google.auth;

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  constructor(private readonly emailConfig: EmailConfig, private readonly emailRepository: EmailRepository) {}

  async sendMail({ to, subject, body, type, user, uuid }: Email): Promise<any> {
    const mailer = await this.createMailer();
    return new Promise((resolve, reject) => {
      mailer.sendMail({ to, from: this.emailConfig.emailTitle, subject, html: body }, async (err, info) => {
        if (err) {
          reject(err);
        }

        resolve(info);
        await this.emailRepository.createEmail({
          email: to,
          type,
          user,
          uuid: uuid || uuidGenerator()
        });
        this.logger.verbose(`Email successfully sent to ${to}`);
      });
    });
  }

  private async requestAccessToken() {
    const oauth2Client = new OAuth2({
      clientId: this.emailConfig.clientId,
      clientSecret: this.emailConfig.clientSecret,
      redirectUri: this.emailConfig.redirectUri
    });

    // eslint-disable-next-line @typescript-eslint/camelcase
    oauth2Client.setCredentials({ refresh_token: this.emailConfig.refreshToken });

    return oauth2Client.getAccessToken();
  }

  private async createMailer() {
    try {
      const { token: accessToken } = await this.requestAccessToken();
      const mailer = createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.emailConfig.email,
          clientId: this.emailConfig.clientId,
          clientSecret: this.emailConfig.clientSecret,
          refreshToken: this.emailConfig.refreshToken,
          accessToken
        }
      });

      return mailer;
    } catch (e) {
      console.log(e);
    }
  }
}
