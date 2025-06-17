import themeConfig from '@/configs/theme.config';
import path from 'path';

const supportedLngs = ['id', 'en'];

export const ni18nConfig = {
  fallbackLng: [themeConfig.locale || 'en'],
  supportedLngs,
  ns: ['translation'],
  react: { useSuspense: false },
  backend: {
    loadPath: path.resolve(`/locales/{{lng}}.json`),
  },
};
