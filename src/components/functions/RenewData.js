import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import itemsList from '../ItemList.json';
import { toast } from 'react-toastify'; // Імпортуємо функції toast з бібліотеки react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Імпортуємо стилі для Toastify
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const Countdown = 10;

const RenewData = () => {
  const [loading, setLoading] = useState(false); // Стан для відображення спінера
  const [countdown, setCountdown] = useState(itemsList.length * Countdown); // Лічильник для таймера

  const handleSearchClick = async () => {
    try {
      setLoading(true); // Встановлюємо loading в true перед початком запитів
      // setShowTimer(true); // Показуємо таймер
      setCountdown(itemsList.length * 10); // Скидуємо лічильник таймера
      // Проходимося по всіх елементах списку itemsList
      for (let i = 0; i < 10; i++) {
        const term = itemsList[i].nameForFetch;
        const encodedTerm = encodeURIComponent(term);
        
        // for web
        // const response = await axios.get(`https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encodedTerm}`);
        
        // for local
        const response = await axios.get(`http://localhost:5000/search-csgo?term=${encodedTerm}`);
        
        
        console.log(response.data)

        
        // for web
        // itemsList[i].price = parseFloat(response.data[i].lowest_price.slice(1));
        // toast.success(`Price for ${term}: ${itemsList[i].price}`, { autoClose: 5000 });
        
        
        //for local
        // Шукаємо відповідний елемент у відповіді
        const matchingItem = response.data.find(item => item.hash_name === term);
        if (matchingItem) {
          itemsList[i].price = parseFloat(matchingItem.sell_price_text.slice(1));
          console.log(itemsList[i].price);
          toast.success(`Price for ${term}: ${itemsList[i].price}`, { autoClose: 5000 });
        } else {
          // If the response array is empty, show a message indicating that prices were not found
          toast.error(`Prices not found for ${term}`, { autoClose: 5000 });
        }
        
        
        
        // Затримка перед наступним запитом
        await new Promise(resolve => setTimeout(resolve, (Countdown*500)));
      }
      console.log('Updated item list:', itemsList);
    } catch (error) {
      console.error('Error renewing data:', error);
      // Додайте логіку обробки помилок тут
    }
    
    try {
      const response = await axios.post('http://localhost:5000/update-items-list', itemsList); // Виконання POST-запиту на сервер
      
      // Отримання повідомлення про успішну операцію від сервера
      toast.success(response.data.message, { autoClose: 5000 });
    } catch (error) {
      console.error('Error updating item list:', error);
      // Додайте логіку обробки помилок тут
    } finally {
      setLoading(false);
      setCountdown(itemsList.length * Countdown); // Reset countdown
    }
  };
  
  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">Wait more :D.</div>;
    }
    
    return (
      <div className="timer">
        {/*<div className="text">Remaining</div>*/}
        <div className="value">{remainingTime}</div>
        <div className="text">seconds</div>
      </div>
    );
  };
  
  
  return (
    <Box maxWidth={390} textAlign="center" sx={{ fontFamily: 'RobotoFlex, sans-serif'}}>
      <div>
        <Button disabled={loading} onClick={handleSearchClick}>
          {loading ? (
            <CountdownCircleTimer
              isPlaying
              duration={countdown}
              colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
              colorsTime={[10, 6, 3, 0]}
              onComplete={() => ({ shouldRepeat: true, delay: 1 })}
              size={90}
              strokeWidth={8}
            >
              {renderTime}
            </CountdownCircleTimer>
          ) : (
              "Renew"
          )}
        </Button>
      </div>
    </Box>
  );
};

export default RenewData;
