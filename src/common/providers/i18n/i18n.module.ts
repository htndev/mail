import { DynamicModule, Module } from '@nestjs/common';
import { merge } from 'lodash';

import { I18nModuleOptions } from './i18n-module.options';
import { DEFAULT_OPTIONS } from './i18n.constant';
import { createProvider } from './i18n.provider';
import { I18nService } from './i18n.service';

@Module({})
export class I18nModule {
  static forRoot(options: I18nModuleOptions): DynamicModule {
    return {
      global: true,
      module: I18nModule,
      providers: [
        {
          provide: I18nModuleOptions,
          useValue: merge(DEFAULT_OPTIONS, options)
        },
        I18nService,
        createProvider()
      ],
      exports: [I18nService, I18nModuleOptions]
    };
  }
}
