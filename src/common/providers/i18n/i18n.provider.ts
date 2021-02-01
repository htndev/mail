import { Provider } from '@nestjs/common';

import { I18N_PROVIDER } from './i18n.constant';
import { I18nService } from './i18n.service';

export const createProvider = (): Provider => ({
  provide: I18N_PROVIDER,
  useFactory: async (i18nService: I18nService) => i18nService.createI18nService(),
  inject: [I18nService]
});
