import { I18nType } from './i18n.type';

export class I18nModuleOptions {
  folder?: string;
  locales?: string | string[];
  fallbackLanguage?: string;
  messages?: I18nType;
  format?: 'json';
  separator?: string;
}
