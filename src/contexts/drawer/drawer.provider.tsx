import React, { useReducer, createContext } from 'react';
export const DrawerContext = createContext<{
  state?: any;
  dispatch?: React.Dispatch<any>;
}>({});

const INITIAL_STATE = {  
  showDetails: false,
  showCart: false,
  showWallets: false,
  showCheckout: false,
  showQr: false,
  showCancelOrder: false,
  showOrderSubmit: false,
  menu: false,
  tesoro: false,
  open: false,
  item: [],
  openWallets: false,
  returnToCart: false
};

type ActionType =  
  | { type: 'STORE_PRODUCT_DETAIL'; payload: any }
  | { type: 'TOGGLE_TESORO_DETAIL'; payload: any }
  | { type: 'TOGGLE_PRODUCT_DETAIL'; payload: any }  
  | { type: 'TOGGLE_CART_VIEW'; payload: any }
  | { type: 'TOGGLE_CHECKOUT_VIEW'; payload: any }
  | { type: 'TOGGLE_QR_VIEW'; payload: any }
  | { type: 'TOGGLE_CANCEL_ORDER_VIEW'; payload: any }
  | { type: 'TOGGLE_ORDER_SUBMIT_VIEW'; payload: any }
  | { type: 'SLIDE_CART'; payload: any }
  | { type: 'OPEN_MENU'; payload: any }
  | { type: 'TOGGLE_WALLETS_VIEW'; payload: any }
  | { type: 'SLIDE_WALLETS'; payload: any }


type StateType = typeof INITIAL_STATE;

function reducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case 'STORE_PRODUCT_DETAIL':
      return {
        ...state,
        item: action.payload.item,
      };
    case 'TOGGLE_TESORO_DETAIL':
      return {
        ...state,
        showTesoro: action.payload.showTesoro,
        showDetails: false,
        showCart: false,
        showWallets: false,
        showCheckout: false,
        showQr: false,
        showCancelOrder: false,
        showOrderSubmit: false,
        returnToCart: false
      };
    case 'TOGGLE_PRODUCT_DETAIL':
      return {
        ...state,
        showTesoro: false,
        showDetails: action.payload.showDetails,
        showCart: false,
        showWallets: false,
        showCheckout: false,
        showQr: false,
        showCancelOrder: false,
        showOrderSubmit: false,
        returnToCart: action.payload.returnToCart
      };
    case 'TOGGLE_CART_VIEW':
      return {
        ...state,
        showTesoro: false,
        showDetails: false,
        showCart: action.payload.showCart,
        showWallets: false,
        showCheckout: false,
        showQr: false,
        showCancelOrder: false,
        showOrderSubmit: false,
        returnToCart: false
      };
    case 'TOGGLE_CHECKOUT_VIEW':
      return {
        ...state,
        showTesoro: false,
        showDetails: false,
        showCart: false,
        showWallets: false,
        showCheckout: action.payload.showCheckout,
        showQr: false,
        showCancelOrder: false,
        showOrderSubmit: false,
        returnToCart: false
      };
    case 'TOGGLE_QR_VIEW':
      return {
        ...state,
        showTesoro: false,
        showDetails: false,
        showCart: false,
        showWallets: false,
        showCheckout: false,
        showQr: action.payload.showQr,
        showCancelOrder: false,
        showOrderSubmit: false,
        returnToCart: false
      };
    case 'TOGGLE_CANCEL_ORDER_VIEW':
      return {
        ...state,
        showTesoro: false,
        showDetails: false,
        showCart: false,
        showWallets: false,
        showCheckout: false,
        showQr: false,
        showCancelOrder: action.payload.showCancelOrder,
        showOrderSubmit: false,
        returnToCart: false
      };
    case 'TOGGLE_ORDER_SUBMIT_VIEW':
      return {
        ...state,
        showTesoro: false,
        showDetails: false,
        showCart: false,
        showWallets: false,
        showCheckout: false,
        showQr: false,
        showCancelOrder: false,
        showOrderSubmit: action.payload.showOrderSubmit,
        returnToCart: false
      };
    case 'SLIDE_CART':
      return {
        ...state,
        open: action.payload.open,
      };
    case 'OPEN_MENU':
      return {
        ...state,
        menu: action.payload.menu,
      };
    
    case 'TOGGLE_WALLETS_VIEW':
      return {
        ...state,
        showTesoro: false,
        showDetails: false,
        showCart: false,
        showWallets:  action.payload.showWallets,
        showCheckout: false,
        showQr: false,
        showCancelOrder: false,
        showOrderSubmit: false,
        returnToCart: false
      };
    case 'SLIDE_WALLETS':
      return {
        ...state,
        openWallets: action.payload.openWallets,
      };    

    default:
      return state;
  }
}

export const DrawerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return (
    <DrawerContext.Provider value={{ state, dispatch }}>
      {children}
    </DrawerContext.Provider>
  );
};
