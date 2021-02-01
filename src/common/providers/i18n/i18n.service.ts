import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { isEmpty, isObject } from 'lodash';

import { I18nModuleOptions } from './i18n-module.options';
import {
  I18nType,
  I18nValue,
  RawI18n,
  TranslateType,
  TransformationType,
  TransformArray,
  TransformObject
} from './i18n.type';

@Injectable()
export class I18nService {
  private logger = new Logger(I18nService.name);
  private _i18n = {};

  get i18n(): I18nType {
    return this._i18n;
  }

  get supportedI18n(): string[] {
    return Object.keys(this.i18n);
  }

  constructor(private readonly options: I18nModuleOptions) {}

  async createI18nService() {
    if (!this.options.folder && !this.options.messages) {
      throw new Error('Cannot load i18n. Folder or messages not provided');
    }

    this._i18n = this.options.folder ? await this.getI18nFromFolder() : this.getI18nFromMessages();

    return this;
  }

  private getI18nFromFolder = async () => {
    const i18ns = await fs.readdir(this.options.folder);
    const locales: string[] = this.options.locales.length
      ? (this.options.locales as string[])
      : i18ns.map(i18nFile => this.getI18nFromFilename(i18nFile));
    const rawI18n: RawI18n[] = await Promise.all(
      locales
        .filter(i18n => locales.includes(i18n))
        .map(async (i18nFile: string) => ({
          lang: this.getI18nFromFilename(i18nFile),
          i18n: await this.loadI18n(`${this.options.folder}/${i18nFile}`)
        }))
    );

    return rawI18n.reduce(
      (acc, { lang, i18n }) => ({
        ...acc,
        [lang]: i18n
      }),
      {}
    );
  };

  private getI18nFromMessages = () => {
    const langs = this.options.locales.length
      ? Array.isArray(this.options.locales)
        ? this.options.locales
        : [this.options.locales]
      : Object.keys(this.options.messages);

    return langs.reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: this.options.messages[lang]
      }),
      {}
    );
  };

  private loadI18n = async (path: string) => {
    try {
      const i18n = await import(path);
      if (i18n instanceof Object) {
        return i18n;
      }

      throw new Error('Failed to parse file');
    } catch (e) {
      if ((e.message = 'Failed to parse file')) {
        throw e;
      }
      throw new Error(`Failed to load ${path}`);
    }
  };

  private getI18nFromFilename = (i18n: string) => i18n.replace(`.${this.options.format}`, '');

  t(key: string, lang: string): string;
  t(key: string, lang: string, transformation: TransformationType): string;
  t(key: string, lang = '', transformation?: TransformationType): string {
    if (!this.supportedI18n.includes(lang)) {
      this.logger.warn(`'${lang}' is not supported. Supported languages: ${this.supportedI18n.join(', ')}`);
    }

    if (!lang && !this.options.fallbackLanguage) {
      return this.uppercaseKey(key);
    }

    const { text, isTranslated } = this.translate(key, lang || this.options.fallbackLanguage);

    if (!isTranslated || !transformation || isEmpty(transformation)) {
      return text;
    }

    return this.transform(text, transformation);
  }

  private translate(key: string, lang: string): TranslateType {
    if (typeof this.i18n?.[lang]?.[key] === 'string') {
      return {
        text: this.i18n[lang][key],
        isTranslated: true
      };
    }

    if (!key.includes(this.options.separator)) {
      this.logger.warn(`Cannot translate '${key}'. To unwrap, use '${this.options.separator}' as separator`);
      return this.translationFailed(key);
    }
    const i18n = this.i18n[lang];

    return this.getI18n(key, i18n, key);
  }

  private getI18n(key: string, i18n: I18nValue, initialKey: string): TranslateType {
    if (isEmpty(i18n)) {
      return this.translationFailed(initialKey);
    }
    if (typeof i18n[key] === 'string') {
      return {
        text: i18n[key],
        isTranslated: true
      };
    }

    const [firstKey, ...rest] = key.split(this.options.separator);

    return this.getI18n(rest.join(this.options.separator), i18n[firstKey], initialKey);
  }

  private transform(text: string, transformation: TransformationType): string {
    let _text = text;

    if (Array.isArray(transformation)) {
      _text = this.transformation.array(text, transformation);
    } else if (isObject(transformation)) {
      _text = this.transformation.object(text, transformation);
    }

    return _text;
  }

  private uppercaseKey = (key: string): string => key.toUpperCase();

  private translationFailed = (key: string): TranslateType => ({ text: this.uppercaseKey(key), isTranslated: false });

  private readonly transformation = {
    array(text: string, items: TransformArray): string {
      let _text = text;

      items.forEach((item, index) => {
        _text = _text.replace(new RegExp(`\\{${index}\\}`, 'g'), item as string);
      });

      return _text;
    },
    object(text: string, item: TransformObject): string {
      let _text = text;

      Object.keys(item).forEach(key => {
        _text = _text.replace(new RegExp(`\\{${key}\\}`, 'g'), item[key] as string);
      });
      return _text;
    }
  };
}
