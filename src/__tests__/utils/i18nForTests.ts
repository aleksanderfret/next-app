import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common from '../../../public/locales/en-GB/common.json';

i18n.use(initReactI18next).init({
  lng: 'en-GB',
  fallbackLng: 'en-GB',
  debug: false,
  ns: ['common'],
  defaultNS: 'common',
  resources: {
    ['en-GB']: {
      common,
    },
    pl: {
      common,
    },
  },
});

export default i18n;
