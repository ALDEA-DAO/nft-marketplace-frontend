import Counter from './counter';
import { CURRENCY } from 'types/constants';
import { useCart } from 'contexts/cart/cart.provider';
import {
  CartItemBase,
  CartItemImage,
  CartItemContent,
  CartItemName,
  CartItemSinglePrice,
  CartItemTotalWrapper,
  CartItemTotalPrice,
} from './utils/theme';
// import ItemOk from 'assets/icons/item-ok';
// import ItemNo from 'assets/icons/item-no';

type CartItemProps = {
  item: any;
  onClick?: (e: any) => void;
};

const CartItem: React.FC<CartItemProps> = ({ item, onClick }) => {
  const { addItem, removeItem } = useCart();

  return (
    <div className={CartItemBase} >
      <div className={CartItemImage} onClick={onClick}>
        <img src={item.image != "" ?   item.image.replace("ipfs://", "https://ipfs.io/ipfs/") : "/img/aldea.gif" } alt={' Alt ' + item.tokenName} />
      
        

      </div>

      <div className={CartItemContent}>
        <span className={CartItemName}  onClick={onClick}>{item.tokenName} ({item.tokenNameHex})
        {/* {item.sold === "FALSE" ? <ItemOk/> : <ItemNo/>} */}
        </span>
        <span className={CartItemSinglePrice}  >
          Precio &nbsp;
          {item.price}
          {CURRENCY}
        </span>

        <div className={CartItemTotalWrapper}>
          <Counter
            value={item.quantity}
            onIncrement={() => addItem(item)}
            onDecrement={() => removeItem(item)}
          />

          <span className={CartItemTotalPrice}>
            {(item.price * item.quantity).toFixed(2)}
            {CURRENCY}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
