import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { itemsList } from '../ItemListWithPrices'; // Імпортуємо список товарів
import jsonData from '../../json/16.04.2024__21_47.json'; // Імпортуємо ціни товарів
import validateItemsList from './ValidationItemList';
import validateJsonData from './ValidationJson';

const ITEMS_PER_ENTRY = 4; // Кількість елементів на кожен запис у списку товарів

// Оптимізована функція для обчислення даних
const calculateData = () => {
  const data = [];
  for (let i = 0; i < itemsList.length; i += 4) {
    const tournament = itemsList[i];
    const name = itemsList[i + 1];
    const price = jsonData[i / 4];
    const quantity = itemsList[i + 2];
    const total = (price * quantity).toFixed(2);
    const spend_on_buy = itemsList[i + 3];
    data.push({ tournament, name, price, quantity, total, spend_on_buy });
  }
  return data;
};

// Оптимізована функція для обчислення загальної ціни
const calculateTotalPrice = () => {
  const totalPrice = {};
  for (let i = 0; i < itemsList.length; i += ITEMS_PER_ENTRY) {
    const tournament = itemsList[i];
    const price = jsonData[i / ITEMS_PER_ENTRY];
    const quantity = itemsList[i + 2];
    const total = (price * quantity).toFixed(2);
    
    if (!totalPrice[tournament]) {
      totalPrice[tournament] = 0;
    }
    totalPrice[tournament] += parseFloat(total);
  }
  return totalPrice;
};

const CustomTable = () => {
  // Виклик функції перевірки itemsList
  validateItemsList();
  
  // Виклик функції перевірки jsonData
  validateJsonData();
  
  const data = useMemo(calculateData, []);
  const totalPrice = useMemo(calculateTotalPrice, []);
  
  const handleClick = (item) => {
    console.log(`Clicked row:`, item);
  };
  
  const totalAllPrice = useMemo(() => {
    return Object.values(totalPrice).reduce((acc, curr) => acc + curr, 0);
  }, [totalPrice]);
  
  return (
    <Box minWidth={390} maxWidth={900} mx="auto">
      <TableContainer component={Paper}>
        <Table style={{ borderCollapse: 'collapse', width: '100%', boxShadow: 'none' }}>
          <TableHead>
            <TableRow>
              <TableCell>Tournament</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Spend on buy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={`${item.tournament}-${item.name}`} data-index={index} onClick={() => handleClick(index)}>
                <TableCell>{item.tournament}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.total}</TableCell>
                <TableCell>{item.spend_on_buy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box maxWidth={390} textAlign="center" sx={{ fontFamily: 'RobotoFlex, sans-serif', margin: '10px auto' }}>
        {Object.entries(totalPrice).map(([tournament, total]) => (
          <div key={tournament}>Total Price for {tournament}: {total.toFixed(2)}</div>
        ))}
        <div>Total Price for All: {totalAllPrice.toFixed(2)}</div>
      </Box>
    </Box>
  );
}

export default CustomTable;