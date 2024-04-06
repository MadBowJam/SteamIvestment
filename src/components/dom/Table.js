import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { itemsList } from '../ItemListWithPrices'; // Імпортуємо список товарів
import jsonData from '../../json/05.04.2024__19_43.json';
import { styled } from '@mui/system';

const StyledTableRow = styled(TableRow)({
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#7dc2ad',
    fontWeight: 'bold',
    color: 'red', // Змінюємо колір тексту на червоний при наведенні на рядок
    '& > *': { // Застосовуємо стилі до всіх клітинок у рядку
      color: 'white',
    },
  },
  '@media (max-width: 960px)': { // Media Query для планшетних пристроїв (ширина до 960px)
    '& > *': {
      padding: '5px !important', // Зміна паддингу на планшетному інтерфейсі
    },
  },
  '@media (max-width: 500px)': { // Media Query для планшетних пристроїв (ширина до 960px)
    '& > *': {
      padding: '3px !important', // Зміна паддингу на мобільному інтерфейсі
    },
  },
});

const CustomTable = () => {
  const data = [];
  const totalPrice = {};
  
  for (let i = 0; i < itemsList.length; i += 4) {
    const tournament = itemsList[i];
    const name = itemsList[i + 1];
    const price = jsonData[i / 4];
    const quantity = itemsList[i + 2];
    const total = (price * quantity).toFixed(2);
    const spend_on_buy = itemsList[i + 3];
    
    if (!totalPrice[tournament]) {
      totalPrice[tournament] = 0;
    }
    totalPrice[tournament] += parseFloat(total);
    
    data.push({ tournament, name, price, quantity, total, spend_on_buy });
  }
  
  const totalAllPrice = Object.values(totalPrice).reduce((acc, curr) => acc + curr, 0);
  
  return (
    <Box minWidth={390} maxWidth={900} mx="auto">
        <TableContainer component={Paper}>
          <Table style={{ borderCollapse: 'collapse', width: '100%', boxShadow: 'none' }}>
            <TableHead>
              <StyledTableRow>
                <TableCell style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Tournament</TableCell>
                <TableCell style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Name</TableCell>
                <TableCell style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Price</TableCell>
                <TableCell style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Quantity</TableCell>
                <TableCell style={{ borderTop: '1px solid #ddd', borderRight: '1px solid #ddd' }}>Total</TableCell>
                <TableCell style={{ borderTop: '1px solid #ddd' }}>Spend on buy</TableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <StyledTableRow key={index}>
                  <TableCell style={{ borderRight: '1px solid #ddd' }}>{item.tournament}</TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd' }}>{item.name}</TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd' }}>{item.price}</TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd' }}>{item.quantity}</TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd' }}>{item.total}</TableCell>
                  <TableCell>{item.spend_on_buy}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      
      
      <Box maxWidth={400} mx="auto" textAlign="center" >
        {Object.entries(totalPrice).map(([tournament, total]) => (
          <div key={tournament}>Total Price for {tournament}: {total.toFixed(2)}</div>
        ))}
        
        <div>Total Price for All: {totalAllPrice.toFixed(2)}</div>
      </Box>

    </Box>
  );
}

export default CustomTable;
