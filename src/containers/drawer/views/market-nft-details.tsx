import React, { useState, useContext } from 'react';
import { Scrollbar } from 'components/scrollbar';
import Button from 'components/button';
import { CURRENCY } from 'types/constants';
import { useCart } from 'contexts/cart/cart.provider';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import ArrowLeft from 'assets/icons/arrow-left';
import Counter from 'components/counter';
import Swal from "sweetalert2";

export default function ProductDetails() {
  const [visibility, setVisibility] = useState(false);
  const { addItem, getItem, removeItem } = useCart();
  const { state, dispatch } = useContext(DrawerContext);

  const count = getItem(state.item.id)?.quantity;

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  const hideDetails = () => {
    dispatch({
      type: 'TOGGLE_PRODUCT_DETAIL',
      payload: {
        showDetails: false,
      },
    });

    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: state.returnToCart,
      },
    });
  };

  const addToCart = async () => {
    if (state.item.sold != "FALSE") {
      console.log("El estado del ítem no permite agregarlo al carrito.");
    } else {
      addItem(state.item);
      dispatch({
        type: 'TOGGLE_CART_VIEW',
        payload: {
          showCart: true,
        },
      });
    }
  };

  const Alert = () => {
    if (state.item.sold === "PENDING") {
      Swal.fire({
        text: "El NFT seleccionado se encuentra pendiente de compra por otro usuario.",
        icon: "warning",
        showConfirmButton:false,
        timer: 3000,
      });
    } else if (state.item.sold === "TRUE"){
      Swal.fire({
        text: "El NFT seleccionado ya ha sido vendido.",
        icon: "error",
        showConfirmButton:false,
        timer: 3000,
      });
    } 
  };

  const ButtonAlert = () => {
    return (
      <button
        className="flex items-center h-12 px-30px justify-center flex-shrink-0 font-normal w-auto uppercase rounded-10px outline-none transition duration-250 ease-in-out focus:outline-none text-gray-500 bg-gray-300 cursor-not-allowed hover:bg-gray-300"
        onClick={Alert}
      >
        Agregar Al Carrito
      </button>
    )    
  };

  const ButtonAddToCart= () => {
    return (
      <Button
        className="w-full big"
        onClick={addToCart}
      >
        Agregar Al Carrito
      </Button>
    )    
  };

  function StatusButton() {
    const statusItem = state.item.sold;
    if (statusItem === "FALSE") {
      return <ButtonAddToCart />;
    } 
    return <ButtonAlert />  
  };
  
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex justify-center relative px-30px py-20px">
        <button
          className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
          onClick={hideDetails}
          aria-label="close"
        >
          <ArrowLeft />
        </button>

        <h2 className="font-bold text-24px m-0">Detalle</h2>
      </div>

      <Scrollbar className="details-scrollbar flex-grow">
        <div className="flex flex-col p-30px pt-0">
          <div className="flex items-center justify-center w-full h-360px overflow-hidden rounded mb-30px">
            <img width={360} src={state.item.image != "" ?   state.item.image.replace("ipfs://", "https://ipfs.io/ipfs/") : "/img/aldea.gif" } alt={' Alt ' + state.item.tokenName} />

  

          </div>

          <div className="flex flex-col items-start mb-4">
            <span className="text-gray-900 font-semibold mb-2">
              {state.item.price}
              {CURRENCY}
            </span>
            <span className="mb-3">{state.item.tokenName} ({state.item.tokenNameHex})</span>

           

      


            <p className="flex items-center mb-5">
              <span className=" text-gray-500 text-11px capitalize">
                {state.item.type}
              </span>
              <span className="flex bg-gray-500 w-3px h-3px rounded mx-3" />
              <span className="text-gray-500 text-11px">
                {state.item.quantity}{' '}
                {state.item.quantity > 1 ? 'Unidades' : 'Unidad'}
              </span>
            </p>
          </div>
          <div className="flex w-full flex-col">



          {state.item.policyIdHex?
  
              <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
                <span className="text-gray-500 text-11px mb-2">PolicyId</span>
                <span className="font-normal text-13px text-gray-900 capitalize">
                  <a href={`${process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_POLICY}${state.item.policyIdHex}`} target="_blank">{state.item.policyIdHex}</a>
                </span>
              </div>
            : 
              <div></div> 
            }



            <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
              <span className="text-gray-500 text-11px mb-2">Descripción</span>
              <span className="font-normal text-13px text-gray-900 capitalize">
                {state.item.description}
              </span>
            </div>
            
            <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
              <span className="text-gray-500 text-11px mb-2">Url</span>
              <span className="font-normal text-13px text-gray-900 capitalize">
                {state.item.url}
              </span>
            </div>

            <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
              <span className="text-gray-500 text-11px mb-2">Tipo</span>
              <span className="font-normal text-13px text-gray-900 capitalize">
                {state.item.type}
              </span>
            </div>

            <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
              <span className="text-gray-500 text-11px mb-2">
                Seller
              </span>
              <span className="font-normal text-13px text-gray-900 capitalize">
                {state.item.sellerName}
              </span>
            </div>


            <div className="flex flex-col justify-start full mt-10 pr-30px even:pr-0">
              <span className="text-gray-500 text-11px mb-2">Artista</span>
              <span className="font-normal text-13px text-gray-900 capitalize">
                {state.item.author}
              </span>
            </div>


          </div>
        </div>
      </Scrollbar>

      <div className="flex flex-col p-30px">
        {count > 0 ? (
          <Counter
            value={count}
            className="ml-auto w-full big"
            size="big"
            onIncrement={() => {
              addItem(state.item);
            }}
            onDecrement={() => removeItem(state.item)}
          />
        ) : (
          <StatusButton />
          // <Button className="w-full big" onClick={addToCart}>
          //   Agregar Al Carrito
          // </Button>
        )}
      </div>
    </div>
  );
}
