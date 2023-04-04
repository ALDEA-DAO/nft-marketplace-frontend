import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from 'containers/layout/layout';
import HeroBlock from 'containers/banner/hero-block';
import Products from 'containers/market-list-nfts';
//import InstagramReview from 'containers/instagram-review';
import { getProducts } from 'helpers/db-get-products';
import { useRefScroll } from 'helpers/use-ref-scroll';
import { useSearch } from 'contexts/search/use-search';
import { ErrorBoundary } from 'components/error';

export default function Home({ products }) {
  const { elRef, scroll } = useRefScroll({
    percentOfElement: 0,
    percentOfContainer: 0,
    offsetPX: -100,
  });
  const { searchTerm } = useSearch();

  useEffect(() => {
    if (searchTerm) return scroll();
  }, [searchTerm]);

  return (
    <Layout>
      <Head>          
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="Descripción" content="El sitio NFT de ALDEA." />
        <title>ALDEA NFT</title>
      </Head>
     

      <HeroBlock />
      
      <Products items={products} ref={elRef} />



    </Layout>

  );
}

export async function getServerSideProps() {

  console.log ("getServerSideProps")


  try{
    const products : any = await getProducts();
    return {
      props: {
        products,
      },
    };

  }catch(err){
    console.error ("getServerSideProps: ERR: " + err)
  }

  
}
