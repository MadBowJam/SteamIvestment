import React from 'react';
import itemsList from '../ItemList.json';

// Функція для перевірки наявності та формату itemsList
const validateItemsList = () => {
  if (!Array.isArray(itemsList)) {
    return <div>Error: itemsList is not in the expected format.</div>;
  }
  
  // Перевірка кожного об'єкта у масиві
  for (let i = 0; i < itemsList.length; i++) {
    const item = itemsList[i];
    if (
      typeof item.nameForFetch !== 'string' ||
      typeof item.tournament !== 'string' ||
      typeof item.name !== 'string' ||
      typeof item.quantity !== 'number' ||
      typeof item.spendOnBuy !== 'number' ||
      typeof item.price !== 'number' ||
      typeof item.currency !== 'string'
    ) {
      return (
        <div>
          Error: Invalid data format in item at index {i} of itemsList.
        </div>
      );
    }
  }
};

export default validateItemsList;
