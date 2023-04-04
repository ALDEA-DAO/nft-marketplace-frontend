import { useState, useContext } from 'react';
import { Scrollbar } from 'components/scrollbar';
import { useCart } from 'contexts/cart/cart.provider';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import CartItem from 'components/market-cart-item';
import Button from 'components/button';
import NoItem from './market-cart-no-item';
import ArrowLeft from 'assets/icons/arrow-left';
import { CURRENCY } from 'types/constants';
import Swal from "sweetalert2";

export default function Cart() {
  const { dispatch } = useContext(DrawerContext);
  const { items, calculatePrice } = useCart();

  const showCheckout = () => {
    dispatch({
      type: 'TOGGLE_CHECKOUT_VIEW',
      payload: {
        showCheckout: true,
      },
    });
  };

  const hideCart = () => {
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: false,
      },
    });
  };

  const showDetails = (item) => {
    dispatch({
      type: 'STORE_PRODUCT_DETAIL',
      payload: {
        item: item,
      },
    });

    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: true,
      },
    });

    dispatch({
      type: 'TOGGLE_PRODUCT_DETAIL',
      payload: {
        showDetails: true,
        returnToCart: true
      },
    });
  };

  // const Alert = () => {   
  //   Swal.fire({
  //     text: "No es posible procesar más de un NFT",
  //     icon: "warning",
  //     showConfirmButton:false,
  //     timer: 3000,
  //   });    
  // };

  function ButtonAddToCart() {
    return <Button
    className="big mt-20px"
    disabled={!items.length ? true : false}
    onClick={showCheckout}
  >
    Confirmar
  </Button>
  };

  // function ButtonAlert() {
  //   return (
  //     <Button
  //       className="big mt-20px"
  //       disabled={!items.length ? true : false}
  //       onClick={Alert}
  //     >
  //       Confirmar1
  //     </Button>
  //   )
  // };

  function StatusButton() {
    // if (items.length === 1) {
      return <ButtonAddToCart />;
    // } else {
    //   return <ButtonAlert />
    // }    
  };
  
  return (
    <div className="flex flex-col w-full h-full">
      {items.length ? (
        <>
          <div className="w-full flex justify-center relative px-30px py-20px border-b border-gray-200">
            <button
              className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
              onClick={hideCart}
              aria-label="close"
            >
              <ArrowLeft />
            </button>

            <h2 className="font-bold text-24px m-0">Tu Carrito</h2>
          </div>

          <Scrollbar className="cart-scrollbar flex-grow">
            {items.map((item) => (
              <CartItem item={item} key={item._id} onClick={() => showDetails(item)} />
            ))}
          </Scrollbar>
        </>
      ) : (
        <NoItem />
      )}

      <div className="flex flex-col p-30px">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">
            Subtotal &nbsp;
          </span>

          <span className="font-semibold text-18px text-gray-900">
            {calculatePrice()}
            {CURRENCY}
          </span>
        </div>  
        <StatusButton/>
      </div>
    </div>
  );
}
