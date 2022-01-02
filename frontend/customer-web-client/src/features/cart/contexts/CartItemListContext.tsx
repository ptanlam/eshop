import { createContext } from 'react';

interface CartItemListContextProps {
  limit: number;
  offset: number;
  currentNumberOfItemsOnPage: number;
}

export const CartItemListContext = createContext<CartItemListContextProps>({
  limit: 0,
  offset: 0,
  currentNumberOfItemsOnPage: 0,
});
