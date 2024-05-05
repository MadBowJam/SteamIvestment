import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Table, TableContainer, TableHead, TablePagination, TextField } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useTableFilter from '../functions/Filter&Search';
import TableHeadComponent from './TableHead';
import CustomTableBody from './TableBody';
import itemsList from '../ItemList.json';
// import jsonData from '../../json/latest.json';
import validateItemsList from '../validation/ValidationItemList';
import validateJsonData from '../validation/ValidationJson';
import CountUp from 'react-countup';
import SteamMarketSearch from '../functions/SteamMarketSearch';
import RenewData from '../functions/RenewData';

const DEFAULT_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 75, 100];

const createItemsData = () => {
  return [...itemsList].reduce((acc, _, i) => {
      const tournament = itemsList[i].tournament;
      const name = itemsList[i].name;
      const price = itemsList[i].price;
      const quantity = itemsList[i].quantity;
      const total = (price * quantity).toFixed(2);
      const spend_on_buy = itemsList[i].spendOnBuy * quantity;
      acc.push({ tournament, name, price, quantity, total, spend_on_buy });
    return acc;
  }, []);
};

const calculateTotalPrice = () => {
  const totalPrice = {};
  for (let i = 0; i < itemsList.length; i++) {
    const tournament = itemsList[i].tournament;
    const price = itemsList[i].price;
    const quantity = itemsList[i].quantity;
    const total = (price * quantity).toFixed(2);
    
    if (!totalPrice[tournament]) {
      totalPrice[tournament] = 0;
    }
    totalPrice[tournament] += parseFloat(total);
  }
  return totalPrice;
};

const CustomTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [sortDirection, setSortDirection] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [openRows, setOpenRows] = useState({}); // Зберігатиме стан відкритих рядків між сторінками
  
  validateItemsList();
  validateJsonData();
  
  const { filteredData, handleSearch, handleSort, searchTerm } = useTableFilter(createItemsData);
  
  const totalAllPrice = useMemo(() => {
    return Object.values(calculateTotalPrice()).reduce((acc, curr) => acc + curr, 0);
  }, []);
  
  const handleSortAndUpdate = (column) => {
    handleSort(column);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setSortedColumn(column);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setOpenRows({})
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  useEffect(() => {
    // При зміні сторінки скидаємо стан відкритих рядків
    setOpenRows({});
  }, [page]);
  
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, rowsPerPage]);
  
  return (
    <Box minWidth={390}
         maxWidth={900}
         mx="auto">
      <ToastContainer/>
      <Box display="flex"
           alignItems="center"
           justifyContent="space-between"
           mb={2}>
        <TextField label="Search"
                   variant="outlined"
                   value={searchTerm}
                   onChange={handleSearch}/>
        <RenewData />
      </Box>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      />
      <TableContainer component={Paper}>
        <Table sx={{borderCollapse: 'collapse'}}>
          <TableHead>
            <TableHeadComponent
              handleSort={handleSortAndUpdate}
              sortDirection={sortDirection}
              sortedColumn={sortedColumn}
              setSortDirection={setSortDirection}
              setSortedColumn={setSortedColumn}
            />
          </TableHead>
          <CustomTableBody filteredData={paginatedData}
                           openRows={openRows}
                           setOpenRows={setOpenRows}/>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
      />
      
      <Box maxWidth={390}
           textAlign="center"
           sx={{fontFamily: 'RobotoFlex, sans-serif', margin: '10px auto'}}>
        {Object.entries(calculateTotalPrice()).map(([tournament, total]) => (
          <div key={tournament}>Total Price for {tournament}: <CountUp start={0}
                                                                       end={total.toFixed(2)}
                                                                       duration={1}
                                                                       decimals={2}/></div>
        ))}
        <div>Total Price for All: <CountUp start={0}
                                           end={totalAllPrice.toFixed(2)}
                                           duration={1}
                                           decimals={2}/></div>
        <div>Total IRL Price: <CountUp start={0}
                                           end={(totalAllPrice * 0.55).toFixed(2)}
                                           duration={1}
                                           decimals={2}/></div>
      </Box>
      
      <SteamMarketSearch/>
    </Box>
  );
}

export default CustomTable;