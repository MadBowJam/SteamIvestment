import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import itemsList from "../ItemList.json";
import {toast} from "react-toastify";

const SteamMarketSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const [itemsList, setItemsList] = useState([]);
  
  const handleSearchClick = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search-csgo?term=${searchValue}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
      toast.error(`Error occurred while fetching`, { autoClose: 5000 });
    }
  };
  
  
  const handleAddClick = (result) => {
    const newItem = {
      nameForFetch: result.hash_name,
      tournament: result.hash_name,
      name: result.name,
      quantity: 1,
      spendOnBuy: 0,
      price: result.sell_price_text
    };

  // Додавання нового елемента до масиву
    itemsList.push(newItem);
    
    // Виклик серверного маршруту для оновлення файлу ItemList.json
    axios.post('http://localhost:5000/update-items-list', itemsList)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error updating item list:', error);
        // Додайте логіку обробки помилок тут
      });
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
              <Button variant="contained" color="primary" onClick={() => handleAddClick(result)}>Add</Button>
            </li>
          ))}
        </ul>
      </div>
    </Box>
  );
};

export default SteamMarketSearch;
