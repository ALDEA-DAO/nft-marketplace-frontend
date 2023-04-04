import React, { useState, useRef } from 'react';
import { CURRENCY } from 'types/constants';
import { useOnClickOutside } from 'helpers/use-OnClickOutside';
// import Button from 'components/button';
// import Counter from 'components/counter';
import { useSpring, animated } from 'react-spring';
import {
  ItemCardBase,
  ItemCardBaseContent,
  ItemCardImage,
  ItemCardContent,
  ItemCardPrice,
  ItemCardName,
  ItemCardInformation,
  ItemCardType,
  ItemCardRoundedDot,
  ItemCardQuantityFalse, 
  ItemCardQuantityPending,
  ItemCardQuantityTrue,
  ItemCardDetailsAnimatedWrapper,
  ItemCardDetailsInformation,
  ItemCardDetailsHalfColumn,
  ItemCardDetailsTitle,
  ItemCardDetailsInfo,
  ItemCardCounterWrapper,
} from 'components/utils/theme';
import { useMeasure } from 'helpers/use-measure';
import { useCart } from 'contexts/cart/cart.provider';

interface ItemProps {
  image: string;
  name: string;
  price: number;
}

interface ItemCardProps {
  item: any;
  onClick?: (e: any) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const { addItem, getItem, removeItem } = useCart();
  const [isOpen, setOpen] = useState(false);
  const elRef = useRef();
  useOnClickOutside(elRef, () => setOpen(false));
  const [{ ref }, { height: viewHeight }] = useMeasure();
  const { opacity, height, transform } = useSpring<any>({
    from: {
      height: 0,
      opacity: 0,
      transform: 'translate3d(0,-50px,0)',
    },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      transform: `translate3d(0,${isOpen ? 0 : -50}px,0)`,
    },
  });
  // const icon = `plus-icon ${isOpen ? 'showed' : ''}`.trim();
  const baseClass = `${ItemCardBase} ${isOpen ? 'details-showed' : ''}`.trim();
  const contentClass = `${ItemCardBaseContent} ${
    isOpen ? 'rounded-b-none shadow-product-item' : ''
  }`.trim();


  function ItemQuantityFalse() {
    return <span className={ItemCardQuantityFalse}>
    {item.quantity} {item.quantity > 1 ? 'Unidades' : 'Unidad'}
  </span>;
  }

  function ItemQuantityPending() {
    return <span className={ItemCardQuantityPending}>
    {'Pendiente'}
  </span>;
  }

  function ItemQuantityTrue() {
    return <span className={ItemCardQuantityTrue}>
    {'Vendido'}
  </span>;
  }

  function ItemQuantityStatus() {
    const statusItem = item.sold;
    if (statusItem === "FALSE") {
      return <ItemQuantityFalse />;
    } else if (statusItem === "PENDING") {
      return <ItemQuantityPending />;  
    } else if (statusItem === "TRUE") {
      return <ItemQuantityTrue />;  
    }
  }

  const count = getItem(item.id)?.quantity;
  return (
    <div ref={elRef} className={baseClass} onClick={onClick}>
      <div className={contentClass} onClick={() => setOpen((prev) => !prev)}>
        {/* <div className={icon} /> */}
        <div className={ItemCardImage}>
          <img
            width={360}
            className="object-cover"
            src={item.image != "" ?   item.image.replace("ipfs://", "https://ipfs.io/ipfs/") : "/img/aldea.gif" }
            alt={' Alt ' + item.tokenName}
          />
        </div>


        <div className={ItemCardContent}>
          <span className={ItemCardName}>{item.tokenName} ({item.tokenNameHex})</span>

          <span className={ItemCardPrice}>
            {item.price}
            {CURRENCY}
          </span>

          <p className={ItemCardInformation}>
            <span className={ItemCardType}>{item.type}</span>
            <span className={ItemCardRoundedDot} />
            <ItemQuantityStatus />            
          </p>
        </div>
      </div>
      
      {/* {isOpen && (
        <animated.div
          style={{ opacity, height: isOpen ? 'auto' : height, transform }}
          ref={ref}
          className={ItemCardDetailsAnimatedWrapper}
        >
          <div className={ItemCardDetailsInformation}>
            {/* <div className={ItemCardDetailsHalfColumn + ' ' + 'mb-5'}>
              <span className={ItemCardDetailsTitle}>Tipo</span>
              <span className={ItemCardDetailsInfo}>{item.type}</span>
            </div> */} {/*

            <div className={ItemCardDetailsHalfColumn + ' ' + 'mb-5'}>
              <span className={ItemCardDetailsTitle}>Formato</span>
              <span className={ItemCardDetailsInfo}>{item.dosage}</span>
            </div>

            <div className={ItemCardDetailsHalfColumn}>
              <span className={ItemCardDetailsTitle}>Artista</span>
              <span className={ItemCardDetailsInfo}>{item.substance}</span>
            </div>

            <div className={ItemCardDetailsHalfColumn}>
              <span className={ItemCardDetailsTitle}>Autor</span>
              <span className={ItemCardDetailsInfo}>{item.manufacturer}</span>
            </div>
          </div>

          <div className={ItemCardCounterWrapper}>
            {count > 0 ? (
              <Counter
                value={count}
                className="ml-auto"
                onIncrement={() => {
                  addItem(item);
                }}
                onDecrement={() => removeItem(item)}
              />
            ) : (
              <Button
                size="small"
                className="m-auto mt-20px w-280px rounded-10px"
                onClick={() => addItem(item)}
              >
                Agregar al carro
              </Button>
            )}
          </div>
        </animated.div>
      )}
       */}
    </div>
  );
};
export default ItemCard;
