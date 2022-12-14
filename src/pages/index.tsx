import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { i18n } from '../../next-i18next.config.mjs';
import Title from 'components/title';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <div>
      <Head>
        <Title>{t('cancel')}</Title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <h1>Home</h1>
        <div>{t('cancel')}</div>
      </main>

      <footer>Date</footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || i18n.defaultLocale)),
    },
  };
};
