import Head from 'next/head';
import Layout from 'containers/layout/layout';
import TermsPageContent from 'containers/terms/terms';

export default function FAQ() {

  return (
    <Layout style={{ height: 'auto' }}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="Description" content="Put your description here." />
        <title>Términos &amp; Condiciones</title>
      </Head>

      <div className="px-0">
        <TermsPageContent />
      </div>
    </Layout>
  );
}
