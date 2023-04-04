import React, { useContext } from 'react';
import ItemCard from 'components/market-list-nft-card';
import { useSearch } from 'contexts/search/use-search';
import { useSearchable } from 'helpers/use-searchable';
import NotFound from 'assets/icons/not-found';
import { DrawerContext } from 'contexts/drawer/drawer.provider';
// import Categories from './categories';

const Products = React.forwardRef(
  ({ items }: any, ref: React.RefObject<HTMLDivElement>) => {
    const { searchTerm } = useSearch();
    const { dispatch } = useContext(DrawerContext);
    const searchableItems = useSearchable(items, searchTerm, (item) => [
      item.tokenName, item.tokenNameHex, item.policyIdHex, item.description
    ]);
    
    const showDetails = (item) => {
      dispatch({
        type: 'STORE_PRODUCT_DETAIL',
        payload: {
          item: item,
        },
      });

      dispatch({
        type: 'SLIDE_CART',
        payload: {
          open: true,
        },
      });

      dispatch({
        type: 'TOGGLE_PRODUCT_DETAIL',
        payload: {
          showDetails: true,
          returnToCart: false
          
        },
      });
    };

    return (
      <div className="w-max overflow-hidden m-auto mt-35px mb-50px p-20px" ref={ref}>
        {/* <Categories/> */}
        {searchableItems.length ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 items-center gap-10 md:gap-4 m-auto">
            {searchableItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onClick={() => showDetails(item)}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center pt-10px md:pt-40px lg:pt-20px pb-40px">
            <NotFound width="100%" />
            <h3 className="text-24px text-gray-900 font-bold mt-35px mb-0 text-center">
              No se encontraron NFTs :(
            </h3>
          </div>
        )}
      </div>
    );
  }
);

export default Products;
