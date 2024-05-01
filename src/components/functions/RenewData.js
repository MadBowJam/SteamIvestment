import React from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import itemsList from '../ItemList.json';
import { toast } from 'react-toastify'; // Імпортуємо функції toast з бібліотеки react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Імпортуємо стилі для Toastify

const RenewData = () => {
  const handleSearchClick = async () => {
    try {
      // Проходимося по всіх елементах списку itemsList
      // for (let i = 0; i < itemsList.length; i++) {
      for (let i = 0; i < 5; i++) {
        const term = itemsList[i].nameForFetch;
        const encodedTerm = encodeURIComponent(term);
        
        const response = await axios.get(`https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encodedTerm}`);
        // const response = await axios.get(`https://steamcommunity.com/market/listings/730/${encodedTerm}`);
        

        
        console.log(response)
        itemsList[i].price = parseFloat(response.data.lowest_price.slice(1));
        console.log(itemsList[i].price)
        toast.success(`Price for ${term}: ${itemsList[i].price}`, { autoClose: 5000 }); // autoClose: 3000 означає, що сповіщення буде закрите через 3 секунди
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
    
    try {
      const response = await axios.post('/update-items-list', itemsList); // Виконання POST-запиту на сервер
      
      // Отримання повідомлення про успішну операцію від сервера
      toast.success(response.data.message, { autoClose: 3000 });
    } catch (error) {
      console.error('Error updating item list:', error);
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
