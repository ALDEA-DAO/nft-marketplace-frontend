import React, { useState, useContext } from 'react';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import ProductDetails from 'containers/drawer/views/market-nft-details';
import Cart from 'containers/drawer/views/market-cart';
import Wallets from 'containers/drawer/views/wallets';
import Checkout from 'containers/drawer/views/market-cart-checkout';
//import Qr from 'containers/drawer/views/qr';
//import OrderNoSubmit from 'containers/drawer/views/market-cart-checkout-order-no-submit';
import OrderSubmit from 'containers/drawer/views/market-cart-checkout-order-submit';
import DrawerMenu from 'containers/drawer/views/menus';
import TesoroDetails from 'containers/drawer/views/tesoro-details';
// Agregados para funcionalidad de cierre de QR Alert y hideQr
import Swal from "sweetalert2";
import { useRouter } from 'next/router';
import { useCart } from 'contexts/cart/cart.provider';
import { useWallets } from 'contexts/wallets/wallets.provider';

export const CartDrawer = () => {
  const { state, dispatch } = useContext(DrawerContext);
  // Agregados para funcionalidad de cierre de QR Alert y hideQr
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { items, calculatePrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshData = () => {
    router.replace(router.asPath);
  };  

  // Alerta para el handeClose overlay
  const Alert = () => {
    Swal.fire({
      text: "¿Realmente quieres cancelar la compra?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero cancelar',
      cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
          hideQr();
        }
      })
  };

  // Funcion para HandeClose sobre el overlay, para poner en un if en caso de que Qr este activo
  const hideQr = async () => {
        
    setLoading(true);

    var user = sessionStorage.getItem("user");
    var email = sessionStorage.getItem("email");
    var idNft = sessionStorage.getItem("idNft");
    var priceNft = sessionStorage.getItem("priceNft");

    const res = await fetch('/api/cancel-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: items,
        user: user,
        email: email,
        //bill_amount: calculatePrice(),
        bill_amount: priceNft,
        idNft: idNft
      }),
    });
    if (res.status === 200) {
      //setSuccess(true);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("email");
      clearCart();
      setLoading(false);
      refreshData();
      dispatch({
        type: 'TOGGLE_CANCEL_ORDER_VIEW',
        payload: {
          showCancelOrder: true,
        },
      });
    } else {
      setError(true);
    }
  };

  // En el cierre de carrito si estado es Qr corre alerta con pregunta
  // En caso afirmativo corre la funcion hideQr y borra los datos de estados, reinicia la base y  envia mail de cancelacion.
  // ELSE: corre el dispach original de la funcion, desplazar el carrito. 
  const handleClose = () => {
    if (state?.showQr === true) {
      Alert();      
    } else {
      dispatch({
        type: 'SLIDE_CART',
        payload: {
          open: false,
        },
      });
    }    
  };
  const drawerComponent = (state) => {

    if (state?.showTesoro === true) {
      return <TesoroDetails />;
    }

    if (state?.showDetails === true) {
      return <ProductDetails />;
    }

    if (state?.showCart === true) {
      return <Cart />;
    }

  

    if (state?.showCheckout === true) {
      return <Checkout />;
    }

    // if (state?.showQr === true) {
    //   return <Qr />;
    // }

    // if (state?.showCancelOrder === true) {
    //   return <OrderNoSubmit />;
    // }

    if (state?.showOrderSubmit === true) {
      return <OrderSubmit />;
    }

    return <Cart />;
  };

  return (
    <React.Fragment>
      {state?.open === true ? (
        <div className="overlay" role="button" onClick={handleClose} />
      ) : null}
      <div
        className={`drawer drawer-cart ${state?.open === true ? 'open' : ''}`}
      >
        {drawerComponent(state)}
      </div>
    </React.Fragment>
  );
};



export const WalletsDrawer = () => {
  const { state, dispatch } = useContext(DrawerContext);
  // Agregados para funcionalidad de cierre de QR Alert y hideQr
  const router = useRouter();

  const { wallets, pollWallets } = useWallets();

  const [successWallets, setSuccessWallets] = useState(false);
  const [loadingWallets, setLoadingWallets] = useState(false);
  const [errorWallets, setErrorWallets] = useState(null);

  const refreshDataWallets = () => {
    router.replace(router.asPath);
  };  


  const handleCloseWallets = () => {
   
      dispatch({
        type: 'SLIDE_WALLETS',
        payload: {
          openWallets: false,
        },
      });
    
  };
  const drawerComponent = (state) => {

    
    if (state?.showWallets === true) {
      return <Wallets />;
    }
    
    //return <Wallets />;
  };

  return (
    <React.Fragment>
      {state?.openWallets === true ? (
        <div className="overlay" role="button" onClick={handleCloseWallets} />
      ) : null}
      <div
        className={`drawer drawer-wallets ${state?.openWallets === true ? 'open' : ''}`}
      >
        {drawerComponent(state)}
      </div>
    </React.Fragment>
  );
};


export const Drawer = () => {
  const { state, dispatch }: any = useContext(DrawerContext);
  const handleClose = () => {
    dispatch({
      type: 'OPEN_MENU',
      payload: {
        menu: false,
      },
    });
  };
  return (
    <React.Fragment>
      {state.menu && (
        <div
          className="overlay overlay-menu"
          role="button"
          onClick={handleClose}
        />
      )}
      <div className={`drawer drawer-menu ${state.menu ? 'open' : ''}`}>
        <DrawerMenu />
      </div>
    </React.Fragment>
  );
};
