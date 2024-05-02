const express = require('express');
const fs = require('fs');
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
  const updatedItemList = req.body;
  const itemListPath = './src/components/ItemList.json';
  
  // Перетворення JavaScript об'єкта в JSON рядок
  const jsonItemList = JSON.stringify(updatedItemList, null, 2);
  
  try {
    const term = req.query.term;
    const results = await searchCSGO(term); // Передаємо значення term в функцію searchCSGO
    res.json(results);
  } catch (error) {
    console.error('Error searching on Steam Market:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
