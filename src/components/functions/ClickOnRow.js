import React, { Fragment } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Функція для обробки кліку по рядку таблиці
const handleClick = (item) => {
  // Виведення в консоль інформації про клікнутий рядок
  console.log(`Clicked row:`, item);
  
  // Обчислення прибутку для клікнутого рядка
  const profit = ((item.total * 100) / item.spend_on_buy).toFixed(0);
  
  // Ініціалізація змінних для відображення тексту та кольору прибутку
  let profitText = `${profit}%`; // Текст прибутку
  let profitColor = 'inherit'; // Колір тексту
  
  // Визначення тексту та кольору прибутку в залежності від значення
  if (profit === 'Infinity') {
    profitText = 'Infinity'; // Якщо прибуток - Infinity
    profitColor = 'green'; // Зелений колір
  } else if (profit <= 100) {
    profitColor = 'red'; // Червоний колір
  } else {
    profitColor = 'green'; // Зелений колір
  }
  
  // Виведення сповіщення про клікнутий рядок з вказанням прибутку
  toast.success(
    <Fragment>
      Clicked row: {item.tournament}-{item.name}, your profit: <span style={{ color: profitColor }}>{profitText}</span>
    </Fragment>
  );
};

export default handleClick;