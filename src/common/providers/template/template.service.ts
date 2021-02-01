import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

import { EmailType } from '../../types/email.type';
import { I18nService } from '../i18n/i18n.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mjml2html = require('mjml');

@Injectable()
export class TemplateService {
  static templatesPath = join(__dirname, '..', '..', 'email', 'templates');
  private cache = {};

  constructor(private readonly i18n: I18nService) {}

  async getTemplate(type: EmailType, lang: string, i18n: Record<string, string> = {}): Promise<string> {
    let html = this.getTemplateFromCache(type) || (await this.getTemplateFromFile(type));
    const fields = { ...i18n, ...this.getCommonFields(lang) };

    Object.keys(fields).forEach(field => {
      html = html.replace(new RegExp(`\{\{\s?${field}\s?\}\}`, 'gm'), fields[field]);
    });

    return html;
  }

  private async loadTemplate(type: EmailType) {
    const templatePath = join(TemplateService.templatesPath, type, 'index.mjml');
    return fs.readFile(templatePath, 'utf8');
  }

  private getCommonFields(lang: string): Record<string, string> {
    return {
      joinUs: this.i18n.t('join-us', lang)
    };
  }

  private getTemplateFromCache(type: EmailType): string | undefined {
    return this.cache[type];
  }

  private async getTemplateFromFile(type: EmailType): Promise<string> {
    const template = await this.loadTemplate(type);

    const { html } = mjml2html(template, {
      filePath: join(TemplateService.templatesPath, 'common')
    }) as { html: string };

    this.cache[type] = html;

    return html;
  }
}
