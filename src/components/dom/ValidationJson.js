import React from 'react';
import jsonData from '../../json/16.04.2024__21_47.json'; // Імпортуємо ціни товарів
import { itemsList } from '../ItemListWithPrices'; // Імпортуємо список товарів

const ITEMS_PER_ENTRY = 4;

// Функція для перевірки наявності та формату jsonData
const validateJsonData = () => {
  if (!Array.isArray(jsonData) || jsonData.length !== itemsList.length / ITEMS_PER_ENTRY) {
    return <div>Error: jsonData is not in the expected format or does not match the length of itemsList.</div>;
  }
};

export default validateJsonData;