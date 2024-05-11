import { updateItemsList } from './SaveItemsList';
import NBU from '../NBU.json';

export const handleCurrencyChange = async (selectedCurrency, itemsList) => {
  const hryvniaRate = NBU[0].rate;
  
  const updatedItemsList = itemsList.map(item => {
    let updatedPrice = item.price;
    let updatedSpendOnBuy = item.spendOnBuy;
    let currency = 'USD';
    
    switch (selectedCurrency) {
      case 'USD':
        updatedPrice /= hryvniaRate;
        updatedSpendOnBuy /= hryvniaRate;
        currency = 'USD';
        break;
      case 'Uah':
        updatedPrice *= hryvniaRate;
        updatedSpendOnBuy *= hryvniaRate;
        currency = 'Uah';
        break;
      default:
        break;
    }
    
    return { ...item, price: updatedPrice, spendOnBuy: updatedSpendOnBuy, currency: currency };
  });
  
  await updateItemsList(updatedItemsList);
  console.log('Updated prices:', updatedItemsList);
};

