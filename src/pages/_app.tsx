import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';

const NextApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default appWithTranslation(NextApp);
