import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TextField
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useTableFilter from '../functions/Filter&Search';
import TableHeadComponent from './TableHead';
import CustomTableBody from './TableBody';
import { itemsList } from '../ItemListWithPrices';
import jsonData from '../../json/19.04.2024__22_08.json';
import validateItemsList from '../validation/ValidationItemList';
import validateJsonData from '../validation/ValidationJson';
import CountUp from 'react-countup';

const ITEMS_PER_ENTRY = 4;

const createItemsData = () => {
  return [...itemsList].reduce((acc, _, i) => {
    if (i % ITEMS_PER_ENTRY === 0) {
      const tournament = itemsList[i];
      const name = itemsList[i + 1];
      const price = jsonData[i / ITEMS_PER_ENTRY];
      const quantity = itemsList[i + 2];
      const total = (price * quantity).toFixed(2);
      const spend_on_buy = itemsList[i + 3];
      acc.push({ tournament, name, price, quantity, total, spend_on_buy });
    }
    return acc;
  }, []);
};

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
  const [sortDirection, setSortDirection] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  
  validateItemsList();
  validateJsonData();
  
  const { filteredData, handleResetSorting, handleSearch, handleSort, searchTerm } = useTableFilter(createItemsData);
  
  const totalAllPrice = useMemo(() => {
    return Object.values(calculateTotalPrice()).reduce((acc, curr) => acc + curr, 0);
  }, []);
  
  const handleSortAndUpdate = (column) => {
    handleSort(column);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setSortedColumn(column);
  };
  
  return (
    <Box minWidth={390} maxWidth={900} mx="auto">
      <ToastContainer />
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <TextField label="Search" variant="outlined" value={searchTerm} onChange={handleSearch} />
        <Button variant="contained" onClick={handleResetSorting}>Reset Sorting</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table style={{ borderCollapse: 'collapse', width: '100%', boxShadow: 'none' }}>
          <TableHead>
            <TableHeadComponent
              handleSort={handleSortAndUpdate}
              sortDirection={sortDirection}
              sortedColumn={sortedColumn}
              setSortDirection={setSortDirection}
              setSortedColumn={setSortedColumn}
            />
          </TableHead>
          <CustomTableBody filteredData={filteredData} />
        </Table>
      </TableContainer>
      <Box maxWidth={390} textAlign="center" sx={{ fontFamily: 'RobotoFlex, sans-serif', margin: '10px auto' }}>
        {Object.entries(calculateTotalPrice()).map(([tournament, total]) => (
          <div key={tournament}>Total Price for {tournament}: <CountUp start={0} end={total.toFixed(2)} duration={1} decimals={2} /></div>
        ))}
        <div>Total Price for All: <CountUp start={0} end={totalAllPrice.toFixed(2)} duration={1} decimals={2} /></div>
      </Box>
    </Box>
  );
}

export default CustomTable;