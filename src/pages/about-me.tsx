import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { GetStaticProps } from 'next';

import { i18n } from '../../next-i18next.config.mjs';
import Title from 'components/title';

export default function AboutMe() {
  return (
    <div>
      <Head>
        <Title>About</Title>
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <h1>About</h1>
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
