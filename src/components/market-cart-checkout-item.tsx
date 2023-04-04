// import Counter from './counter';
import { CURRENCY } from 'types/constants';
import { useCart } from 'contexts/cart/cart.provider';
// import {
//   CartItemBase,
//   CartItemImage,
//   CartItemContent,
//   CartItemName,
//   CartItemSinglePrice,
//   CartItemTotalWrapper,
//   CartItemTotalPrice,
// } from './utils/theme';
// import ItemOk from 'assets/icons/item-ok';
// import ItemNo from 'assets/icons/item-no';

type CheckoutItemProps = {
  item: any;
};

const CheckoutItem: React.FC<CheckoutItemProps> = ({ item }) => {
  // const { addItem, removeItem } = useCart();
  
  return (
    <div className="flex items-center justify-between mb-20px">
      <span className="font-semibold text-gray-900">
      {item.tokenName} ({item.tokenNameHex}) &nbsp;
      </span>

      <span className="font-semibold text-18px text-gray-900">
          {(item.price * item.quantity).toFixed(2)}
          {CURRENCY}
      </span>
    </div>
  );
};

export default CheckoutItem;