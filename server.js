const express = require('express');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;
const { searchCSGO } = require('./test_steam_market_search');

app.use(express.json());

app.post('/update-items-list', (req, res) => {
  const updatedItemList = req.body;
  const itemListPath = './src/components/ItemList.json';
  
  // Перетворення JavaScript об'єкта в JSON рядок
  const jsonItemList = JSON.stringify(updatedItemList, null, 2);
  
  // Запис у файл
  fs.writeFile(itemListPath, jsonItemList, (err) => {
    if (err) {
      console.error('Error writing item list to file:', err);
      res.status(500).json({ error: 'Error writing item list to file' });
    } else {
      console.log('Item list updated and saved to file');
      res.status(200).json({ message: 'Item list updated and saved successfully' });
    }
  });
});

app.get('/search-csgo', async (req, res) => {
  try {
    const term = req.query.term;
    const results = await searchCSGO(term); // Передаємо значення term в функцію searchCSGO
    res.json(results);
  } catch (error) {
    console.error('Error searching on Steam Market:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Одноразовий виклик функції для фільтрації та збереження даних у файл
  await saveFilteredDataToFile();
});

const fetchNBUData = async () => {
  try {
    const response = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    return response.data;
  } catch (error) {
    console.error('Error fetching NBU data:', error);
    return null;
  }
};

const filterDesiredCurrencies = (data) => {
  if (!data || !Array.isArray(data)) {
    console.error('Invalid data format');
    return [];
  }
  
  const desiredCurrencies = ['Долар США'];
  
  return data.filter(item => desiredCurrencies.includes(item.txt));
};

const saveFilteredDataToFile = async () => {
  const data = await fetchNBUData();
  const filteredData = filterDesiredCurrencies(data);
  
  if (filteredData.length > 0) {
    try {
      fs.writeFileSync('./src/components/NBU.json', JSON.stringify(filteredData, null, 2));
      console.log('Filtered NBU data saved to NBU.json');
    } catch (error) {
      console.error('Error saving filtered NBU data to file:', error);
    }
  } else {
    console.error('No desired data found in NBU');
  }
};
