import { useState, useContext } from 'react';
import { Scrollbar } from 'components/scrollbar';
import { useWallets } from 'contexts/wallets/wallets.provider';
import { DrawerContext } from 'contexts/drawer/drawer.provider';

import Button from 'components/button';

import ArrowLeft from 'assets/icons/arrow-left';
import { CURRENCY } from 'types/constants';

import Swal from "sweetalert2";

import { Tab, Tabs, RadioGroup, Radio, FormGroup, InputGroup, NumericInput } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";


export default function Wallets() {
 
  const { dispatch } = useContext(DrawerContext);
  const { wallets, whichWalletSelected , pollWallets,handleWalletSelect,connectWithWallet,walletFound ,walletIsEnabled,walletAPIVersion,walletName} = useWallets();
 
  //console.log ("VIEW WALLET: " + wallets + " SELECT: "+ whichWalletSelected)


  const hideWallets = () => {
    dispatch({
      type: 'SLIDE_WALLETS',
      payload: {
        openWallets: false,
      },
    });
  };

 
  return (
    
    <div className="flex flex-col w-full h-full">
     
        <>
          <div className="w-full flex justify-center relative px-30px py-20px border-b border-gray-200">
            <button
              className="w-auto h-10 flex items-center justify-center text-gray-500 absolute top-half -mt-20px left-30px transition duration-300 focus:outline-none hover:text-gray-900"
              onClick={hideWallets}
              aria-label="close"
            >
              <ArrowLeft />
            </button>

            <h2 className="font-bold text-24px m-0">Connectar con Wallet</h2>
          </div>
              <Button
                size="small"
                className="m-auto mt-20px w-280px rounded-10px"
                onClick={() => pollWallets()}
              >
               Buscar Wallets Instaladas
              </Button>

          <Scrollbar className="cart-scrollbar flex-grow">
 
            {wallets.length ? (
        <>

         

         
          <div style={{marginBottom: 15}}>Seleccionar Wallet:</div>
            <RadioGroup
                onChange={handleWalletSelect}
                selectedValue={whichWalletSelected}
                inline={true}
                className="wallets-wrapper"
            >
                { wallets.map(key =>
                    <Radio
                        key={key}
                        className="wallet-label"
                        value={key}>
                          { (key in window.cardano) ?(<><img src={window.cardano[key].icon} width={24} height={24} alt={key}/>
                        {window.cardano[key].name} ({key})</>):(<>{key}</>) }
                        
                    </Radio>
                )}
            </RadioGroup>
       
            <Button
                size="small"
                className="m-auto mt-20px w-280px rounded-10px"
                onClick={() => {connectWithWallet();hideWallets()}}
              >
                Conectar con Wallet
              </Button>       

              <p style={{paddingTop: "20px"}}><span style={{fontWeight: "bold"}}>Wallet Found? </span>{`${walletFound}`}</p>
              <p><span style={{fontWeight: "bold"}}>Wallet Ready? </span>{`${walletIsEnabled}`}</p>
              <p><span style={{fontWeight: "bold"}}>Wallet API version: </span>{walletAPIVersion}</p>
              <p><span style={{fontWeight: "bold"}}>Wallet name: </span>{walletName}</p>   
              
        </>
      ) : (
        
        

        <div><p>No se detecto Wallet</p></div>
      )}


            

            <div>Paso a paso de como instalar wallets:

            <li>Yoroi</li>
            <li>Nami</li>
            <li>Eternl</li>
             <li>Nufi</li>
             <li>Typhon</li>
             <li>Hero</li>
             <li>Flint</li>

             <p>TODO: agregar links</p>

              </div>

          </Scrollbar>
        </>
   

    </div>
  );
}
