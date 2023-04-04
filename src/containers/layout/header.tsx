import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import PhoneIcon from 'assets/icons/phone';
import CartIcon from 'assets/icons/cart-icon';
import TesoroIcon from 'assets/icons/tesoro-icon';
import Logo from 'assets/icons/logo';
import Search from 'components/search';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import { useCart } from 'contexts/cart/cart.provider';
import { useWallets } from 'contexts/wallets/wallets.provider';
import { useRouter } from 'next/router';
import LoadingSpinner from "components/LoadingSpinner";

export default function Header() {
  const router = useRouter();
  const { dispatch }: any = useContext(DrawerContext);
  const { itemsCount } = useCart();
  const {  wallets, whichWalletSelected ,walletIsEnabled, balance } = useWallets();

  const [isLoadedBalace, setIsLoadedBalace] = useState(false);

  useEffect(() => {
    console.log("Header useEffect: balance: " + balance )
    
    if (walletIsEnabled && (balance! && balance != "")) {
      
      setIsLoadedBalace (true)
    }else{
      setIsLoadedBalace (false)

    }

  }, [balance]);
  
  const showTesoro = () => {
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: true,
      },
    });
    dispatch({
      type: 'TOGGLE_TESORO_DETAIL',
      payload: {
        showTesoro: true,
      },
    });
  };

  const showMenu = () => {
    dispatch({
      type: 'OPEN_MENU',
      payload: {
        menu: true,
      },
    });
  };

  const showWallets = () => {
    console.log("SHOWWALLETS")
    dispatch({
      type: 'SLIDE_WALLETS',
      payload: {
        openWallets: true,
      },
    });
    dispatch({
      type: 'TOGGLE_WALLETS_VIEW',
      payload: {
        showWallets: true,
      },
    });
  };

    

  const showCart = () => {
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: true,
      },
    });
    dispatch({
      type: 'TOGGLE_CART_VIEW',
      payload: {
        showCart: true,
      },
    });
  };

  const isHome = router.pathname === '/';

  function StatusWalletButton() {
    // wallets, whichWalletSelected ,walletIsEnabled
    if (walletIsEnabled) {

      return <>{!isLoadedBalace ? <><LoadingSpinner /><div >Conectando ...</div></> : <>{window.cardano[whichWalletSelected].name} ({whichWalletSelected}) | Balance: {balance}</>}</>;;
      // return <div>{window.cardano[whichWalletSelected].name} ({whichWalletSelected}) | Balance: {balance}</div>;
    } else {
      return <div>Conectar Wallet</div>;
    }    
  };

  return (
    <header className="flex items-center shadow-mobile text-gray-700 body-font fixed bg-white w-full h-90px z-20 lg:shadow-header pr-20px md:pr-30px lg:pr-40px">
      <button
        aria-label="Menu"
        className="menuBtn flex flex-col items-center justify-center w-50px flex-shrink-0 h-full outline-none focus:outline-none lg:w-90px"
        onClick={showMenu}
      >
        <span className="menuIcon">
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </span>
      </button>

      <Link href="/">
        <a className="hidden mx-auto lg:mr-10 lg:flex">
          {/* <span className="sr-only">Medsy</span> */}
          <Logo id="medsy-header-logo" />
        </a>
      </Link>

      <div className="w-full ml-10px mr-20px lg:mr-10 lg:ml-auto lg:flex lg:justify-center">
        {isHome && <Search />}
      </div>

{/*       <button
        className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none"
        onClick={showTesoro}
        aria-label="cart-button"
      >
        <TesoroIcon />
      </button> */}
      <button
        className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none"
        onClick={showWallets}
        aria-label="cart-button"
      >
        <div style={{ marginRight: '10px'}}><StatusWalletButton/></div>
        
      </button>
      <button
        className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none"
        onClick={showCart}
        aria-label="cart-button"
      >
        <CartIcon width="20px" height="20px" />
        <span
          className="w-18px h-18px flex items-center justify-center bg-gray-900 text-white absolute rounded-full"
          style={{ fontSize: '10px', top: '-10px', right: '-10px' }}
        >
          {itemsCount}
        </span>
      </button>
    </header>
  );
}
