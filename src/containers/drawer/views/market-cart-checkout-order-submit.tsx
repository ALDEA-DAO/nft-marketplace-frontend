import { useState, useContext, useEffect } from 'react';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import ArrowLeft from 'assets/icons/arrow-left';
import ProcessOk from 'assets/icons/process-ok';
import Swal from 'sweetalert2';

export default function OrderSubmit() {
  const { dispatch } = useContext(DrawerContext);
  const hideCart = () => {
    sessionStorage.clear();
    dispatch({
      type: 'SLIDE_CART',
      payload: {
        open: false,
      },
    });
  };

  useEffect(() => {

    var idNft = sessionStorage.getItem("idNft");

    if (parseInt(idNft,10) >= 45) {
      var imagen = "random/" + idNft + ".jpg";
      var mensaje = "¡Recibirás este NFT!\nGracias por colaborar con el Tesoro de ALDEA.";

      Swal.fire({
        text: mensaje,
        imageUrl: imagen,
        imageWidth: 250,
        imageHeight: 250,
        imageAlt: 'Custom image',
      })
    }

    return () => {
      "Borrar sesiones"
    }

  }, [])  

  return (
    <>
      <div className="w-full flex px-30px relative">
        <button
          className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
          onClick={hideCart}
          aria-label="close"
        >
          <ArrowLeft />
        </button>
      </div>

      <div className="flex flex-col pb-60px flex-auto justify-center">
        <div className="flex items-center justify-center text-green">
          <ProcessOk />
        </div>

        <div className="flex flex-col items-center px-40px md:px-80px mt-15px">
          <h3 className="text-center text-18px font-semibold text-gray-900 mb-40px">
            Confirmación de compra
          </h3>
          <p className="text-center text-14px font-semibold text-gray-900 mb-1">
            Muchas gracias por tu compra.
          </p>
          <p className="text-center text-13px text-gray-700">
          Recibirás tu NFT en tu wallet pronto! Chequea tu correo para más información.
          </p>
        </div>
      </div>
    </>
  );
}
