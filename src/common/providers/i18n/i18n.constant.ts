import { I18nModuleOptions } from './i18n-module.options';

export const I18N_PROVIDER = Symbol('I18N_PROVIDER');

export const DEFAULT_OPTIONS: Required<I18nModuleOptions> = {
  folder: '',
  fallbackLanguage: 'en',
  messages: {},
  locales: [],
  format: 'json',
  separator: '.'
};
