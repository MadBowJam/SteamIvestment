const express = require('express');
const steamMarketSearch = require('steam-market-search');
const { searchCSGO } = require('./test_steam_market_search');

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
