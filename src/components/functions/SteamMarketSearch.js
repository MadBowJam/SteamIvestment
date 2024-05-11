import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import itemsList from "../ItemList.json";
import {toast} from "react-toastify";
import { updateItemsList } from './SaveItemsList'; // Імпорт функції

const SteamMarketSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearchClick = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search-csgo?term=${searchValue}`);
      if (response.data.length === 0) {
        toast.error(`No data found`, { autoClose: 5000 });
      } else {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast.error(`Error occurred while fetching`, { autoClose: 5000 });
    }
  };
  
  const handleAddClick = async (result) => {
    const newItem = {
      nameForFetch: result.hash_name,
      tournament: result.hash_name,
      name: result.name,
      quantity: 1,
      spendOnBuy: 0,
      price: parseFloat(result.sell_price_text.slice(1).replace(',', ''))
    };
    
    await updateItemsList([...itemsList, newItem]);
  };
  
  return (
    <Box className="SteamMarketSearch">
      <div>
        <input
          className="SteamMarketSearchInput"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchClick();
            }
          }}
        />
        
        <button className="SteamMarketSearchButton" onClick={handleSearchClick}>Search</button>
        <ul className="SteamMarketSearchList">
          {searchResults.map(({asset_description, hash_name, name, sell_price_text}, index) => (
            <li className="SteamMarketSearchItem" key={index}>
              {asset_description.name}
              <Button variant="contained"
                      color="primary"
                      onClick={() => handleAddClick({hash_name, name, sell_price_text})}>Add</Button>
            </li>
          ))}
        </ul>
      </div>
    </Box>
  );
};

export default SteamMarketSearch;