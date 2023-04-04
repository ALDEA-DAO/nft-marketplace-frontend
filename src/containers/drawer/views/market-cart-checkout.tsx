import ArrowLeft from 'assets/icons/arrow-left';
import Button from 'components/button';
import Input from 'components/input';
import CheckoutItem from 'components/market-cart-checkout-item';
import { Scrollbar } from 'components/scrollbar';
import {
  InputBase,
  TextBoxCommonBase,
  TextBoxEnable
} from 'components/utils/theme';
import { useCart } from 'contexts/cart/cart.provider';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
import { useWallets } from 'contexts/wallets/wallets.provider';
import { buyNFTEndPoint } from 'helpers/cardano';
import initalizeLucid from 'helpers/cardano-initialize-lucid';
import { useLocalStorage } from 'helpers/use-storage2';
import { toJson } from 'helpers/utils';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import LoadingSpinner from "components/LoadingSpinner";



export default function Checkout() {
  const router = useRouter();
  const { dispatch } = useContext(DrawerContext);

  const [userName, setUserName] = useLocalStorage ("userName", "");
  const [userEmail, setUserEmail] = useLocalStorage ("userEmail", "");
  
  const initialState = {
    buyerName: userName,
    buyerMail: userEmail,
  };

  const [formData, setFormData] = useState(initialState);

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { items, calculatePrice, clearCart } = useCart();
  var execute = false;


  const { walletAPI, walletIsEnabled, balance, networkId, utxos, tokens, collateralUtxos, changeAddress, addresses, publicKeys, getWalletData, } = useWallets();

  const [isLoadedPublicKey, setIsLoadedPublicKey] = useState(false);

  useEffect(() => {
    console.log("BUY useEffect: publicKeys: " + publicKeys )
    
    if (publicKeys! && publicKeys.length > 0) {
      console.log("BUY useEffect: publicKeys: " + publicKeys )
      setIsLoadedPublicKey (true)
    }else{
      setIsLoadedPublicKey (false)

    }

  }, [publicKeys]);


  const hideCheckout = () => {
    dispatch({
      type: 'TOGGLE_CHECKOUT_VIEW',
      payload: {
        showCheckout: false,
      },
    });
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };


  const orderOk = async () => {
    clearCart();
    setLoading(false);
    //runBeforeUnload = "true";
    refreshData();
    dispatch({
      type: 'TOGGLE_ORDER_SUBMIT_VIEW',
      payload: {
        showOrderSubmit: true,
      },
    });
  };

  const submitOrder = async () => {

    console.log("Buy Submit: ")


    const { buyerMail, buyerName } = formData;
    
    if (!buyerName) {
      setError({
        field: 'buyerName',
        message: 'El nombre es requerido',
      });
      setTimeout(() => setError(false), 3000);
      return;
    }

    if (typeof buyerMail !== "undefined") {
      let lastAtPos = buyerMail.lastIndexOf('@');
      let lastDotPos = buyerMail.lastIndexOf('.');
      if (!(lastAtPos < lastDotPos && lastAtPos > 0 && buyerMail.indexOf('@@') == -1 && lastDotPos > 2 && (buyerMail.length - lastDotPos) > 2)) {
        setError({
          field: 'buyerMail',
          message: 'Ingresa un correo electrónico válido',
        });
        setTimeout(() => setError(false), 3000);
        return;
      }
    }

    if (!publicKeys || publicKeys.length == 0) {
      Swal.fire({
        icon: "error",
        text: "No pude obtener su Public Payment Key. Prube conectando nuevamente su Wallet.",
        showConfirmButton: true,
        //timer: 5000,
      });

      setError(true);
      setTimeout(() => setLoading(false), 2000);
      refreshData();
      return;
    }

    setLoading(true);

    let data = {
      items: items,
      buyerName: buyerName,
      buyerMail: buyerMail.toLowerCase(),
      buyerPkh: publicKeys[0],
      bill_amount: calculatePrice(),
    }

    var submittedTxHash

    try {
      submittedTxHash = await buyNFTAction(data)
    } catch (err) {
      console.error("Error Building BuyNFT Tx: " + err)

      Swal.fire({
        icon: "error",
        text: "Error Building BuyNFT Tx: " + err,
        showConfirmButton: true,
        //timer: 5000,
      });

      setError(true);
      setTimeout(() => setLoading(false), 2000);
      refreshData();
      return;
    }

    try {
      // Send the data to the server in JSON format.

      data["submittedTxHash"] = submittedTxHash;

      const JSONdata = toJson(data)

      // API endpoint where we send form data.
      const endpoint = '/api/buy'

      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json',
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      }

      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options)
      const json = await response.json()
      const messageJson = json.data

      switch (response.status) {
        case 200:
          console.log("/api/buy: " + messageJson)
          setSuccess(true);
          orderOk();
          //sendConfirmationEmail();
          return;
        case 202:
        case 400:
        case 500:
        default:
          throw messageJson;
      }
    } catch (err) {
      console.error("/api/buy error: " + err)
      Swal.fire({
        text: "Error: " + err,
        icon: "error",
        showConfirmButton: true,
        // timer: 5000,
      });
      setError(true);
      setTimeout(() => setLoading(false), 2000);
      refreshData();
    }
  };

  //-----------------------------------

  const buyNFTAction = async (data) => {

    console.log("Buy NFT Action")

    const lucid = await initalizeLucid(walletAPI)

    const txHash = await buyNFTEndPoint(lucid!, data);

    //await awaitTx(lucid!, txHash)

    return txHash.toString();

    //return "aaff"

  }



  //-----------------------------------

  const onChange = (e) => {
    const { value, name } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex justify-center relative px-30px py-20px">
        <button
          className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
          onClick={hideCheckout}
          aria-label="close"
        >
          <ArrowLeft />
        </button>
        <h2 className="font-bold text-24px m-0">Tu Carrito</h2>
      </div>

      <Scrollbar className="checkout-scrollbar flex-grow">
        <div className="flex flex-col px-30px pt-20px">
          <div className="flex flex-col mb-45px">
            <span className="flex font-semibold text-gray-900 text-18px mb-15px">
              Información de Contacto
            </span>
            <Input
              placeholder="Nombre"
              name="buyerName"
              value={formData.buyerName}
              onChange={onChange}
              className={`${InputBase} ${TextBoxCommonBase} ${TextBoxEnable}`}
            />
            {error?.field === 'buyerName' && (
              <p className="text-12px font-semibold text-error pt-10px pl-15px">
                {error.message}
              </p>
            )}
            <Input
              placeholder="Correo electrónico"
              name="buyerMail"
              value={formData.buyerMail}
              onChange={onChange}
              className="mt-15px"
            />
            {error?.field === 'buyerMail' && (
              <p className="text-12px font-semibold text-error pt-10px pl-15px">
                {error.message}
              </p>
            )}
          </div>
        </div>
      </Scrollbar>

      <div className="flex flex-col p-30px">

        {items.map((item) => (
          <CheckoutItem item={item} key={item._id} />
        ))}


{!isLoadedPublicKey ? <><div >Cargando datos desde wallet... espere por favor</div></> :  
<></>}
            
<Button className="big w-full" onClick={submitOrder} loading={loading || !walletIsEnabled || !isLoadedPublicKey} disabled={loading || !walletIsEnabled || !isLoadedPublicKey}>
          Realizar Pago
        </Button>
        

      </div>
    </div>
  );
}



