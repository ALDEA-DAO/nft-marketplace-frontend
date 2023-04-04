import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import 'rc-collapse/assets/index.css';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import 'react-multi-carousel/lib/styles.css';
import 'assets/styles/index.css';
import { CartProvider } from 'contexts/cart/cart.provider';
import { WalletsProvider } from 'contexts/wallets/wallets.provider';
import { DrawerProvider } from 'contexts/drawer/drawer.provider';
import { StickyProvider } from 'contexts/sticky/sticky.provider';
import { SearchProvider } from 'contexts/search/use-search';


import { ErrorBoundary } from 'components/error';

import 'typeface-open-sans';
import * as ga from '../lib/ga';

export default function CustomApp({ Component, pageProps }) {

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    
    <SearchProvider>
      <StickyProvider>
        <DrawerProvider>
          <CartProvider>
            <WalletsProvider>
            < Component {...pageProps} />
            </WalletsProvider>
          </CartProvider>
        </DrawerProvider>
      </StickyProvider>
    </SearchProvider>
  
  );
}
