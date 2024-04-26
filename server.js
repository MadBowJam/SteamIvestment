const express = require('express');
const { fetchData } = require('./src/SteamPriceCheck'); // Замініть 'SteamPriceCheck' на шлях до вашого файлу, де знаходиться код fetchData
const app = express();
const PORT = process.env.PORT || 3000;

// Маршрут для запуску функції fetchData
app.get('/api/fetch-data', async (req, res) => {
  try {
    await fetchData();
    res.json({ message: 'Data fetched successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Запускаємо сервер
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
