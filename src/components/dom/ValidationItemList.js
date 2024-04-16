import React from 'react';
import { itemsList } from '../ItemListWithPrices';

// Функція для перевірки наявності та формату itemsList
const validateItemsList = () => {
  if (!Array.isArray(itemsList)) {
    return <div>Error: itemsList is not in the expected format.</div>;
  }
};

export default validateItemsList;