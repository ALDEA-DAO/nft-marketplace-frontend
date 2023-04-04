
import { searchAndGetKeyInObject, searchKeyInObject, toJson } from "helpers/utils";
import { Lucid } from "lucid-cardano";
//import { useReducerAsync } from "use-reducer-async";

const pollWallets =   (state, action) => {
  var wallets = [];
  for(const key in window.cardano) {
    if (window.cardano[key].enable && wallets.indexOf(key) === -1) {
        wallets.push(key);
    }
  }

  console.log("POLLWALLETS Count " + state.pollWalletsCount)

  if (wallets.length === 0 && state.pollWalletsCount < 3) {
    setTimeout(() => {
      console.log("POLLWALLETS timeout " + state.pollWalletsCount)
      state.pollWalletsCount = state.pollWalletsCount + 1
      wallets = pollWallets(state, action);
    }, 1000);
    return wallets;
  }

  console.log("POLLWALLETS wallets: "+ wallets)
  console.log("POLLWALLETS whichWalletSelected: "+ state.whichWalletSelected)
  
  return wallets
}


const handleWalletSelect =  (state, action) => {

  const whichWalletSelected = action.payload

  console.log("handleWalletSelect "+ whichWalletSelected)

  return whichWalletSelected
     
}


const getWalletName =  (state) => {
  const walletKey = state.whichWalletSelected;
  const walletName = window?.cardano?.[walletKey].name;
  console.log("walletName: "+ walletName)
  return walletName;
}

const getAPIVersion =  (state) => {
  const walletKey = state.whichWalletSelected;
  var walletAPIVersion

  walletAPIVersion = searchAndGetKeyInObject( window?.cardano?.[walletKey], "apiVersion")

  if (!walletAPIVersion){
    walletAPIVersion = searchAndGetKeyInObject( window?.cardano?.[walletKey], "version")
  }

  console.log("getAPIVersion: "+ walletAPIVersion)

  return walletAPIVersion;
}



export const reducer =  (state, action) => {
  switch (action.type) {
    case 'REHYDRATE':
      console.log("Wallet Reducer - REHYDRATE" + toJson(action.payload ))

      return { ...state, ...action.payload };

    case 'TOGGLE_WALLETS':
      console.log("Wallet Reducer - TOGGLE_WALLETS")
      return { ...state, isOpenWallets: !state.isOpenWallets };
    
    case 'POLL_WALLETS':

      console.log("Wallet Reducer - POLL_WALLETS")

      const wallets = pollWallets(state, action);
      
      var whichWalletSelected = state.whichWalletSelected

      if ((!whichWalletSelected || whichWalletSelected === "") && wallets.length >0) {
        whichWalletSelected = wallets[0]
      }
  
      return {...state, wallets, whichWalletSelected: whichWalletSelected}

    case 'SELECT_WALLETS':
      console.log("Wallet Reducer - SELECT_WALLETS")

      return { ...state, whichWalletSelected: handleWalletSelect(state, action) };
    
    case 'CONNECTED_WALLETS_FOUND':
      console.log("Wallet Reducer - CONNECTED_WALLETS_FOUND")

      return {...state, walletFound: true};

    case 'CONNECTED_WALLETS_NOT_FOUND':

      console.log("Wallet Reducer - CONNECTED_WALLETS_NOT_FOUND")
      return {...state,walletFound: false};
  
    
    case 'CONNECTED_WALLETS_SUCCESS':

      console.log("Wallet Reducer - CONNECTED_WALLETS_SUCCESS")
      return {
        ...state,
        walletAPIConnected: true,
        walletAPI: action.walletAPI, 
        walletAPIVersion: getAPIVersion(state),
        walletName: getWalletName(state)
      };

    case 'CONNECTED_WALLETS_ERROR':

      console.log("Wallet Reducer - CONNECTED_WALLETS_ERROR")
      return {
        ...state,
        walletAPIConnected: false,
        walletAPI: undefined, 
        walletAPIVersion: undefined,
        walletName: undefined
      };
      
    case 'CONNECTED_WALLETS_ENABLED':

      console.log("Wallet Reducer - CONNECTED_WALLETS_ENABLED")
      return {...state,walletIsEnabled: true};

    case 'CONNECTED_WALLETS_DISABLED':

      console.log("Wallet Reducer - CONNECTED_WALLETS_DISABLED")
      return {...state,walletIsEnabled: false};

    case 'SET_BALANCE':
      console.log("Wallet Reducer - SET_BALANCE")


      return {...state,balance: action.balance};

    case 'SET_NETWORK_ID':
      console.log("Wallet Reducer - SET_NETWORK_ID")
      return {...state,networkId: action.networkId};

    case 'SET_UTXOS':
      console.log("Wallet Reducer - SET_UTXOS")
      return {...state,utxos: action.utxos};  

    case 'SET_TOKENS':
      console.log("Wallet Reducer - SET_TOKENS")
      return {...state,tokens: action.tokens};    
  
    case 'SET_COLLATERAL_UTXOS':
      console.log("Wallet Reducer - SET_COLLATERAL_UTXOS")
      return {...state,collateralUtxos: action.collateralUtxos};

    case 'SET_CHANGE_ADDRESS':
      console.log("Wallet Reducer - SET_CHANGE_ADDRESS")
      return {...state,changeAddress: action.changeAddress};

    case 'SET_ADDRESSES':
      console.log("Wallet Reducer - SET_ADDRESSES")
      return {...state,addresses: action.addresses};

    case 'SET_PUBLIC_KEYS':
      console.log("Wallet Reducer - SET_PUBLIC_KEYS")
      return {...state,publicKeys: action.publicKeys};

    case 'SET_WALLET_LOADED_DATA':
      console.log("Wallet Reducer - SET_WALLET_LOADED_DATA - " + action.walletDataLoaded)
      return {...state,walletDataLoaded: action.walletDataLoaded};

    default:
      throw new Error(`Wallet reducer Unknown action: ${action.type}`);
  }
};



