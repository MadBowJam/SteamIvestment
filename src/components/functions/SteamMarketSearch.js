import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';

const SteamMarketSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearchClick = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search-csgo?term=${searchValue}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
      // Додайте логіку обробки помилок тут
    }
  };
  
  return (
    <Box maxWidth={390} textAlign="center" sx={{ fontFamily: 'RobotoFlex, sans-serif', margin: '10px auto' }}>
      <div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={handleSearchClick}>Search</button>
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>
              {result.asset_description.name}
              <Button variant="contained" color="primary">Add</Button>
            </li>
          ))}
        </ul>
      </div>
    </Box>
  );
};

export default SteamMarketSearch;
