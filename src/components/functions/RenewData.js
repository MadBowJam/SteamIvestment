import React from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import itemsList from '../ItemList.json';

const RenewData = () => {
  const handleSearchClick = async () => {
    try {
      // Проходимося по всіх елементах списку itemsList
      for (let i = 0; i < itemsList.length; i++) {
        const term = itemsList[i].nameForFetch;
        
        const encodedTerm = encodeURIComponent(term);
        
        console.log(encodedTerm)
        
        const response = await axios.get(`https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encodedTerm}`);
        
        // Шукаємо співпадіння зі списком предметів
        const matchingItem = response.lowest_price;
        
        console.log(matchingItem)
        // if (matchingItem) {
          // Оновлюємо ціну у списку предметів, видаляючи перший символ
          itemsList[i].price = parseFloat(matchingItem.sell_price_text.slice(1));
          console.log(itemsList[i].price)
        // }
        
        // Затримка перед наступним запитом
        await new Promise(resolve => setTimeout(resolve, 4000));
      }
      
      // Зберігаємо оновлений список предметів у файл ItemList.json
      // Ви можете використати звичайний спосіб збереження файлів або бібліотеку для роботи з файлами
      console.log('Updated item list:', itemsList);
    } catch (error) {
      console.error('Error renewing data:', error);
      // Додайте логіку обробки помилок тут
    }
  };
  
  
  return (
    <Box maxWidth={390} textAlign="center" sx={{ fontFamily: 'RobotoFlex, sans-serif', margin: '10px auto' }}>
      <div>
        <Button onClick={handleSearchClick}>Renew</Button>
      </div>
    </Box>
  );
};

export default RenewData;
