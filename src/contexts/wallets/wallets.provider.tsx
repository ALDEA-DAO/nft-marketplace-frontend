import { createContext, useContext } from 'react';
//import { reducer, cartItemsTotalPrice } from './wallets.reducer';
import { useStorage } from 'helpers/use-storage';
import { useReducerAsync } from "use-reducer-async";
import { reducer } from './wallets.reducer';

import { addrToPubKeyHash, showPtrInHex } from 'helpers/cardano-utils';
import { toJson } from 'helpers/utils';
import { C } from "lucid-cardano";


let Buffer = require('buffer/').Buffer


const WalletsContext = createContext({} as any);

const INITIAL_STATE = {
  isOpenWallets: false,

  pollWalletsCount: 0,
  wallets: [],

  whichWalletSelected: undefined,

  walletFound: false,

  walletAPIConnected: false,
  walletAPI: undefined,
  walletAPIVersion: undefined,

  walletIsEnabled: false,


  walletDataLoaded: false,


  walletName: undefined,
  walletIcon: undefined,

  balance: undefined,

  networkId: undefined,

  utxos: undefined,
  tokens: undefined,

  collateralUtxos: undefined,
  changeAddress: undefined,

  addresses: undefined,
  publicKeys: undefined,
};



const checkIfWalletFound = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - checkIfWalletFound")

  const walletKey = state.whichWalletSelected;
  const walletFound = !!window?.cardano?.[walletKey];

  if (walletFound) {

    //console.log("Wallet Provider - Helpers - checkIfWalletFound wallet found");
    dispatch({ type: 'CONNECTED_WALLETS_FOUND' });

  } else {

    //console.log("Wallet Provider - Helpers - checkIfWalletFound wallet not found");
    dispatch({ type: 'CONNECTED_WALLETS_NOT_FOUND' });
  }

  return walletFound
}

const connectWallet = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - connectWallet whichWalletSelected " + state.whichWalletSelected)

  const walletKey = state.whichWalletSelected;

  try {

    await window.cardano[walletKey].enable()

      .then(async function (walletAPI) {

        console.log("Wallet Provider - Helpers - connectWallet: walletAPI: " + walletAPI)

        dispatch({ type: 'CONNECTED_WALLETS_SUCCESS', walletAPI: walletAPI });

        dispatch({ type: 'GET_WALLET_DATA' });

        return true

      })
      .catch(function (err) {
        console.error("Wallet Provider - Helpers - connectWallet error: " + err);
        dispatch({ type: 'CONNECTED_WALLETS_ERROR' });
        return false
      });

  } catch (err) {

    console.error("Wallet Provider - Helpers - connectWallet error2: " + err);
    dispatch({ type: 'CONNECTED_WALLETS_ERROR' });
    return false
  }


}

const checkIfWalletEnabled = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - checkIfWalletEnabled")

  let walletIsEnabled = false;

  const walletKey = state.whichWalletSelected;

  try {
    walletIsEnabled = await window.cardano[walletKey].isEnabled();

    console.log("Wallet Provider - Helpers - checkIfWalletEnabled walletIsEnabled: " + walletIsEnabled)

    if (walletIsEnabled) {
      dispatch({ type: 'CONNECTED_WALLETS_ENABLED', walletIsEnabled: true });
      return true

    } else {
      dispatch({ type: 'CONNECTED_WALLETS_DISABLED', walletIsEnabled: false });
      return false
    }

  } catch (err) {
    console.error("Wallet Provider - Helpers - checkIfWalletEnabled err:" + err)
    dispatch({ type: 'CONNECTED_WALLETS_DISABLED', walletIsEnabled: false });
    return false
  }

}

const getBalance = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - getBalance")

  try {

    // const walletKey = state.whichWalletSelected;
    // const walletIsEnabled =  await window.cardano[walletKey].isEnabled();

    // console.log("Wallet Provider - Helpers - getBalance: walletIsEnabled " + walletIsEnabled)

    // if (!walletIsEnabled) await connectWallet(state,dispatch)

    const balanceCBORHex = await state.walletAPI.getBalance();

    const balance = C.Value.from_bytes(Buffer.from(balanceCBORHex, "hex")).coin().to_str();

    dispatch({ type: 'SET_BALANCE', balance: balance });

    console.log("Wallet Provider - Helpers - getBalance:" + balance)

    return balance

  } catch (err) {

    console.error("Wallet Provider - Helpers - getBalance: err: " + err)

    return undefined
  }
}

const getNetworkId = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - getNetworkId")

  try {
    const networkId = await state.walletAPI.getNetworkId();

    dispatch({ type: 'SET_NETWORK_ID', networkId: networkId });

    console.log("Wallet Provider - Helpers - getNetworkId: " + networkId)

  } catch (err) {

    console.error("Wallet Provider - Helpers - getNetworkId: err: " + err)
  }
}

const getUtxos = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - getUtxos")

  let utxos = [];

  try {
    const rawUtxos = await state.walletAPI.getUtxos();

    //console.log("Wallet Provider - Helpers - getUtxos: rawUtxos: " + rawUtxos)

    for (const rawUtxo of rawUtxos) {
      const utxo = C.TransactionUnspentOutput.from_bytes(Buffer.from(rawUtxo, "hex"));
      const input = utxo.input();
      const txid = Buffer.from(input.transaction_id().to_bytes(), "utf8").toString("hex");
      const txindx = showPtrInHex(input.index());

      // console.log ("txindx "+ txindx)
      // console.log ("txindx "+ toJson(txindx))
      // console.log ("txindx "+ showPtrInHex(txindx))



      const output = utxo.output();
      const amount = output.amount().coin().to_str(); // ADA amount in lovelace
      const multiasset = output.amount().multiasset();
      let multiAssetStr = "";

      if (multiasset) {
        const keys = multiasset.keys() // policy Ids of thee multiasset
        const N = keys.len();
        // console.log(`${N} Multiassets in the UTXO`)


        for (let i = 0; i < N; i++) {
          const policyId = keys.get(i);
          const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString("hex");
          // console.log(`policyId: ${policyIdHex}`)
          const assets = multiasset.get(policyId)
          const assetNames = assets.keys();
          const K = assetNames.len()
          // console.log(`${K} Assets in the Multiasset`)

          for (let j = 0; j < K; j++) {
            const assetName = assetNames.get(j);
            const assetNameString = Buffer.from(assetName.name(), "utf8").toString();
            const assetNameHex = Buffer.from(assetName.name(), "utf8").toString("hex")
            const multiassetAmt = multiasset.get_asset(policyId, assetName)
            multiAssetStr += ` + ${multiassetAmt.to_str()} ${policyIdHex} . ${assetNameHex} (${assetNameString})`
            // console.log(assetNameString)
            // console.log(`Asset Name: ${assetNameHex}`)
          }
        }
      }


      const obj = {
        txid: txid,
        txindx: txindx,
        amount: amount,
        str: `${txid} # ${txindx} = ${amount}`,
        multiAssetStr: multiAssetStr,
        TransactionUnspentOutput: utxo
      }

      utxos.push(obj);

    }

    dispatch({ type: 'SET_UTXOS', utxos: utxos });

    // console.log("Wallet Provider - Helpers - getUtxos: lenght: " + utxos.length)  

  } catch (err) {

    console.error("Wallet Provider - Helpers - getUtxos: err: " + err)
  }
}

const getTokens = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - getTokens")

  let tokens = [];

  try {
    const rawUtxos = await state.walletAPI.getUtxos();

    //console.log("Wallet Provider - Helpers - getTokens: rawUtxos: " + rawUtxos)

    for (const rawUtxo of rawUtxos) {
      const utxo = C.TransactionUnspentOutput.from_bytes(Buffer.from(rawUtxo, "hex"));
      const input = utxo.input();
      const txid = Buffer.from(input.transaction_id().to_bytes(), "utf8").toString("hex");
      const txindx = showPtrInHex(input.index());
      const output = utxo.output();
      const amount = output.amount().coin().to_str(); // ADA amount in lovelace
      const multiasset = output.amount().multiasset();

      if (multiasset) {
        const keys = multiasset.keys() // policy Ids of thee multiasset
        const N = keys.len();
        // console.log(`${N} Multiassets in the UTXO`)


        for (let i = 0; i < N; i++) {
          const policyId = keys.get(i);
          const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString("hex");
          // console.log(`policyId: ${policyIdHex}`)
          const assets = multiasset.get(policyId)
          const assetNames = assets.keys();
          const K = assetNames.len()
          // console.log(`${K} Assets in the Multiasset`)

          for (let j = 0; j < K; j++) {
            const assetName = assetNames.get(j);
            const assetNameString = Buffer.from(assetName.name(), "utf8").toString();
            const assetNameHex = Buffer.from(assetName.name(), "utf8").toString("hex")
            const multiassetAmt = multiasset.get_asset(policyId, assetName)
            const multiAssetStr = `${multiassetAmt.to_str()} ${policyIdHex} . ${assetNameHex} (${assetNameString})`
            // console.log(assetNameString)
            // console.log(`Asset Name: ${assetNameHex}`)

            const obj = {
              txid: txid,
              txindx: txindx,
              amount: amount,

              policyIdHex: policyIdHex,
              assetNameHex: assetNameHex,
              assetNameString: assetNameString,
              multiassetAmt: multiassetAmt.to_str(),

              str: `${txid} # ${txindx} = ${amount}`,
              multiAssetStr: multiAssetStr,

              TransactionUnspentOutput: utxo
            }

            tokens.push(obj);
          }
        }
      }

    }

    dispatch({ type: 'SET_TOKENS', tokens: tokens });

    console.log("Wallet Provider - Helpers - getTokens: length: " + tokens.length)

  } catch (err) {

    console.error("Wallet Provider - Helpers - getTokens: err: " + err)
  }
}

const getCollateralUtxos = async (state, dispatch) => {


  console.log("Wallet Provider - Helpers - getCollateralUtxos")

  try {

    let collateralUtxos = [];
    let rawCollateralUtxos = [];

    const wallet = state.whichWalletSelected;

    if (wallet === "nami") {
      rawCollateralUtxos = await state.walletAPI.experimental.getCollateral();
    } else {
      rawCollateralUtxos = await state.walletAPI.getCollateral();
    }

    //TODO: chekear esto del maximo de collaterales por transaccion. Parece que son 3 pero antes tenía muchos más y funcionaba.

    const maxCollateralUtxos = 2
    var auxCantidad = 0
    for (const raCollateralUtxo of rawCollateralUtxos) {
      const utxo = C.TransactionUnspentOutput.from_bytes(Buffer.from(raCollateralUtxo, "hex"));

      const input = utxo.input();
      const txid = Buffer.from(input.transaction_id().to_bytes(), "utf8").toString("hex");
      const txindx = showPtrInHex(input.index());
      const output = utxo.output();
      const amount = output.amount().coin().to_str(); // ADA amount in lovelace
      const multiasset = output.amount().multiasset();
      let multiAssetStr = "";

      if (multiasset) {
        const keys = multiasset.keys() // policy Ids of thee multiasset
        const N = keys.len();
        // console.log(`${N} Multiassets in the UTXO`)


        for (let i = 0; i < N; i++) {
          const policyId = keys.get(i);
          const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString("hex");
          // console.log(`policyId: ${policyIdHex}`)
          const assets = multiasset.get(policyId)
          const assetNames = assets.keys();
          const K = assetNames.len()
          // console.log(`${K} Assets in the Multiasset`)

          for (let j = 0; j < K; j++) {
            const assetName = assetNames.get(j);
            const assetNameString = Buffer.from(assetName.name(), "utf8").toString();
            const assetNameHex = Buffer.from(assetName.name(), "utf8").toString("hex")
            const multiassetAmt = multiasset.get_asset(policyId, assetName)
            multiAssetStr += ` + ${multiassetAmt.to_str()} ${policyIdHex} . ${assetNameHex} (${assetNameString})`
            // console.log(assetNameString)
            // console.log(`Asset Name: ${assetNameHex}`)
          }
        }
      }

      const obj = {
        txid: txid,
        txindx: txindx,
        amount: amount,
        str: `${txid} # ${txindx} = ${amount}`,
        multiAssetStr: multiAssetStr,
        TransactionUnspentOutput: utxo
      }

      collateralUtxos.push(obj)

      auxCantidad += 1;
      if (auxCantidad > maxCollateralUtxos) {
        break;
      }
      // console.log(utxo)
    }

    dispatch({ type: 'SET_COLLATERAL_UTXOS', collateralUtxos: collateralUtxos });

    //console.log("Wallet Provider - Helpers - getCollateralUtxos: length: " + collateralUtxos.length)  

  } catch (err) {

    console.error("Wallet Provider - Helpers - getCollateralUtxos: err: " + err)
  }

}

const getChangeAddress = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - getChangeAddress")

  try {

    const raw = await state.walletAPI.getChangeAddress();

    const changeAddress = C.Address.from_bytes(Buffer.from(raw, "hex")).to_bech32(undefined)

    dispatch({ type: 'SET_CHANGE_ADDRESS', changeAddress: changeAddress });

    //console.log("Wallet Provider - Helpers - getChangeAddress: " + changeAddress)  

  } catch (err) {

    console.error("Wallet Provider - Helpers - getChangeAddress: err: " + err)
  }

}

const getAddresses = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - getAddresses")

  try {

    let addresses = [];
    const raws = await state.walletAPI.getUsedAddresses();
    for (const raw of raws) {

      const usedAddress = C.Address.from_bytes(Buffer.from(raw, "hex")).to_bech32(undefined)
      addresses.push(usedAddress)

    }
    
    const raws2 = await state.walletAPI.getUnusedAddresses();
    for (const raw of raws2) {

      const unusedAddress = C.Address.from_bytes(Buffer.from(raw, "hex")).to_bech32(undefined)
      addresses.push(unusedAddress)

    }
    

    dispatch({ type: 'SET_ADDRESSES', addresses: addresses });

    //console.log("Wallet Provider - Helpers - getAddresses: length: " + addresses.length)  

  } catch (err) {

    console.error("Wallet Provider - Helpers - getAddresses: err: " + err)
  }
}

const getPublicKeys = async (state, dispatch) => {

  console.log("Wallet Provider - Helpers - getPublicKeys")

  try {

    let publicKeys = [];

    for (const usedAddress of state.addresses) {

      const publicKey = addrToPubKeyHash(usedAddress)

      if (publicKey) {
        //console.log("Wallet Provider - Helpers - publicKey: " + publicKey)  
        publicKeys.push(publicKey)
      }
    }

    dispatch({ type: 'SET_PUBLIC_KEYS', publicKeys: publicKeys });

    //console.log("Wallet Provider - Helpers - getPublicKeys: " + publicKeys)  

  } catch (err) {

    console.error("Wallet Provider - Helpers - getPublicKeys: err: " + err)
  }
}

const asyncActionHandlers = {

  CONNECT_WALLETS: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - CONNECT_WALLETS action:" + toJson(action))

    let state = await getState()

    console.log("Wallet Provider - AsyncActionHandlers - CONNECT_WALLETS: whichWalletSelected " + state.whichWalletSelected)

    const walletFound = await checkIfWalletFound(state, dispatch)

    state = await getState()

    console.log("Wallet Provider - AsyncActionHandlers - CONNECT_WALLETS: walletFound " + state.walletFound)

    if (state.walletFound) {

      const walletAPIConnected = await connectWallet(state, dispatch)

      state = await getState()

      console.log("Wallet Provider - AsyncActionHandlers - CONNECT_WALLETS: walletAPIConnected " + state.walletAPIConnected)

      if (state.walletAPIConnected) {

        const walletIsEnabled = await checkIfWalletEnabled(state, dispatch)

        state = await getState()

        console.log("Wallet Provider - AsyncActionHandlers - CONNECT_WALLETS: walletIsEnabled " + state.walletIsEnabled)

        if (state.walletIsEnabled) {

          //const balance = await getBalance(state, dispatch)

          //state = await getState()

          //console.log("Wallet Provider - AsyncActionHandlers - CONNECT_WALLETS: balance " + state.balance)

        }
      }
    }
  },

  GET_BALANCE: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - GET_BALANCE action:" + toJson(action))

    let state = getState()

    await getBalance(state, dispatch)
  },


  GET_NETWORK_ID: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - GET_NETWORK_ID action:" + toJson(action))

    let state = getState()

    await getNetworkId(state, dispatch)
  },

  GET_UTXOS: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - GET_UTXOS action:" + toJson(action))

    let state = getState()

    await getUtxos(state, dispatch)
  },


  GET_TOKENS: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - GET_TOKENS action:" + toJson(action))

    let state = getState()

    await getTokens(state, dispatch)
  },


  GET_COLLATERAL_UTXOS: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - GET_COLLATERAL_UTXOS action:" + toJson(action))

    let state = getState()

    await getCollateralUtxos(state, dispatch)
  },

  GET_CHANGE_ADDRESS: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - GET_CHANGE_ADDRESS action:" + toJson(action))

    let state = getState()

    await getChangeAddress(state, dispatch)
  },

  GET_ADDRESSES: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - GET_ADDRESSES action:" + toJson(action))

    let state = getState()

    await getAddresses(state, dispatch)
  },

  GET_PLUBIC_KEYS: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - GET_PLUBIC_KEYS action:" + toJson(action))

    let state = getState()

    if (state.addresses == undefined) {
      await getAddresses(state, dispatch)
      state = getState()
    }

    await getPublicKeys(state, dispatch)
  },


  GET_WALLET_DATA: ({ dispatch, getState, signal }) => async (action) => {

    console.log("Wallet Provider - AsyncActionHandlers - GET_WALLET_DATA action:" + toJson(action))

    await dispatch({ type: 'SET_WALLET_LOADED_DATA', walletDataLoaded: false });

    let state = getState()

    state.balance = undefined

    state.networkId = undefined

    state.utxos = undefined
    state.tokens = undefined

    state.collateralUtxos = undefined
    state.changeAddress = undefined

    state.addresses = undefined
    state.publicKeys = undefined

    await getBalance(state, dispatch)

    await getNetworkId(state, dispatch)

    await getUtxos(state, dispatch)

    await getTokens(state, dispatch)

    await getCollateralUtxos(state, dispatch)
    await getChangeAddress(state, dispatch)

    await getAddresses(state, dispatch)

    state = getState()

    await getPublicKeys(state, dispatch)

    dispatch({ type: 'SET_WALLET_LOADED_DATA', walletDataLoaded: true });

    //state = getState()

  },

};

const resetWallet = (state) => {

  console.log("Wallet Provider - Helpers - resetWallet")

  state.walletFound = false
  state.walletAPIConnected = false
  state.walletIsEnabled = false

  state.walletDataLoaded = false

  state.balance = undefined

  state.networkId = undefined

  state.utxos = undefined
  state.tokens = undefined

  state.collateralUtxos = undefined
  state.changeAddress = undefined

  state.addresses = undefined
  state.publicKeys = undefined

}

const useWalletsActions = (initialWallets = INITIAL_STATE) => {

  //console.log("Wallet Provider - Actions - useWalletsActions")

  const [state, dispatch] = useReducerAsync(reducer, initialWallets, asyncActionHandlers);

  const toggleWalletsHandler = () => {
    
    console.log("Wallet Provider - Actions - toggleWalletsHandler")

    dispatch({ type: 'TOGGLE_WALLETS' });
  };

  const rehydrateLocalState = async (payload) => {
    //useStorage solamente guarda si se habia conectado y el nombre de la wallet
    //si se habia conectado, se conecta de nuevo

    console.log("Wallet Provider - Actions - rehydrateLocalState: " + toJson (payload))

    if (payload.walletAPIConnected && payload.whichWalletSelected != "") {

      dispatch({ type: 'REHYDRATE', payload });
      dispatch({ type: 'POLL_WALLETS' });
      dispatch({ type: 'CONNECT_WALLETS' });
    }
    
  };

  const pollWalletsHandler = () => {

    console.log("Wallet Provider - Actions - pollWalletsHandler")

    //resetWallet(state)

    dispatch({ type: 'POLL_WALLETS' });
  };

  const handleWalletSelectHandler = (obj) => {

    console.log("Wallet Provider - Actions - handleWalletSelectHandler")

    resetWallet(state)

    dispatch({ type: 'SELECT_WALLETS', payload: obj.target.value });
  };

  const connectWithWalletHandler = () => {

    console.log("Wallet Provider - Actions - connectWithWalletHandler")

    resetWallet(state)

    dispatch({ type: 'CONNECT_WALLETS' });
  };

  const getBalanceHandler = () => {

    console.log("Wallet Provider - Actions - getBalanceHandler")

    dispatch({ type: 'GET_BALANCE' });
  };

  const getNetworkIdHandler = () => {

    console.log("Wallet Provider - Actions - getNetworkIdHandler")

    dispatch({ type: 'GET_NETWORK_ID' });
  };

  const getUtxosHandler = () => {

    console.log("Wallet Provider - Actions - getUtxosHandler")

    dispatch({ type: 'GET_UTXOS' });
  };

  const getTokensHandler = () => {

    console.log("Wallet Provider - Actions - getTokensHandler")

    dispatch({ type: 'GET_TOKENS' });
  };

  const getCollateralUtxosHandler = () => {

    console.log("Wallet Provider - Actions - getCollateralUtxosHandler")

    dispatch({ type: 'GET_COLLATERAL_UTXOS' });
  };

  const getChangeAddressHandler = () => {

    console.log("Wallet Provider - Actions - getChangeAddressHandler")

    dispatch({ type: 'GET_CHANGE_ADDRESS' });
  };


  const getAddressesHandler = () => {

    console.log("Wallet Provider - Actions - getAddressesHandler")

    dispatch({ type: 'GET_ADDRESSES' });
  };

  const getPublicKeysHandler = () => {

    console.log("Wallet Provider - Actions - getPublicKeysHandler")

    dispatch({ type: 'GET_PLUBIC_KEYS' });
  };

  const getWalletDataHandler = () => {
    
    console.log("Wallet Provider - Actions - getWalletDataHandler")

    dispatch({ type: 'GET_WALLET_DATA' });
  };

  return {
    state,

    rehydrateLocalState,
    toggleWalletsHandler,

    pollWalletsHandler,
    handleWalletSelectHandler,
    connectWithWalletHandler,

    getBalanceHandler,

    getNetworkIdHandler,

    getUtxosHandler,
    getTokensHandler,

    getCollateralUtxosHandler,
    getChangeAddressHandler,

    getAddressesHandler,
    getPublicKeysHandler,

    getWalletDataHandler,

  };
};

export const WalletsProvider = ({ children }) => {
  const {
    state,
    rehydrateLocalState,
    toggleWalletsHandler,
    pollWalletsHandler,
    handleWalletSelectHandler,
    connectWithWalletHandler,
    getBalanceHandler,
    getNetworkIdHandler,
    getUtxosHandler,
    getTokensHandler,
    getCollateralUtxosHandler,
    getChangeAddressHandler,
    getAddressesHandler,
    getPublicKeysHandler,
    getWalletDataHandler,
  } = useWalletsActions();

  //const { rehydrated, error } = useStorage(state, rehydrateLocalState);

  const myStorage = { whichWalletSelected: state.whichWalletSelected, walletAPIConnected: state.walletAPIConnected }

  const { rehydrated, error } = useStorage(myStorage, rehydrateLocalState);

  return (
    <WalletsContext.Provider
      value={{
        isOpenWallets: state.isOpenWallets,
        pollWalletsCount: state.pollWalletsCount,
        wallets: state.wallets,
        whichWalletSelected: state.whichWalletSelected,
        walletFound: state.walletFound,
        walletAPIConnected: state.walletAPIConnected,
        walletAPI: state.walletAPI,
        walletAPIVersion: state.walletAPIVersion,
        walletIsEnabled: state.walletIsEnabled,
        walletDataLoaded: state.walletDataLoaded,
        walletName: state.walletName,
        walletIcon: state.walletIcon,
        balance: state.balance,
        networkId: state.networkId,
        utxos: state.utxos,
        tokens: state.tokens,
        collateralUtxos: state.collateralUtxos,
        changeAddress: state.changeAddress,
        addresses: state.addresses,
        publicKeys: state.publicKeys,
        toggleWallets: toggleWalletsHandler,
        pollWallets: pollWalletsHandler,
        handleWalletSelect: handleWalletSelectHandler,
        connectWithWallet: connectWithWalletHandler,
        getBalance: getBalanceHandler,
        getNetworkId: getNetworkIdHandler,
        getUtxos: getUtxosHandler,
        getTokens: getTokensHandler,
        getCollateralUtxos: getCollateralUtxosHandler,
        getChangeAddress: getChangeAddressHandler,
        getAddresses: getAddressesHandler,
        getPublicKeys: getPublicKeysHandler,
        getWalletData: getWalletDataHandler,
      }}
    >
      {children}
    </WalletsContext.Provider>
  );
};

export const useWallets = () => useContext(WalletsContext);
