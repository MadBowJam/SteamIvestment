import React from 'react';
import jsonData from '../../json/latest.json'; // Імпортуємо ціни товарів
import itemsList from '../ItemList'; // Імпортуємо список товарів

// Функція для перевірки наявності та формату jsonData
const validateJsonData = () => {
  if (!Array.isArray(jsonData) || jsonData.length !== itemsList.length) {
    return <div>Error: jsonData is not in the expected format or does not match the length of itemsList.</div>;
  }
};

export default validateJsonData;