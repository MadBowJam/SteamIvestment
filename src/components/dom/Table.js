import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TablePagination,
  TextField,
  MenuItem,
  Select,
  Pagination
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useTableFilter from '../functions/Filter&Search';
import TableHeadComponent from './TableHead';
import CustomTableBody from './TableBody';
import itemsList from '../ItemList.json';
import validateItemsList from '../validation/ValidationItemList';
import CountUp from 'react-countup';
import SteamMarketSearch from '../functions/SteamMarketSearch';
import RenewData from '../functions/RenewData';
import { handleCurrencyChange } from '../functions/Currency';
import Stack from '@mui/material/Stack';

const DEFAULT_ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 75, 100];
const IRL_MONEY = 0.55 // in real life money koef

const createItemsData = () => {
  return [...itemsList].reduce((acc, _, i) => {
    const tournament = itemsList[i].tournament;
    const name = itemsList[i].name;
    const price = itemsList[i].price;
    const quantity = itemsList[i].quantity;
    const total = (price * quantity).toFixed(2);
    const spendOnBuy = itemsList[i].spendOnBuy * quantity;
    acc.push({ tournament, name, price, quantity, total, spendOnBuy });
    return acc;
  }, []);
};

export const calculateTotalPrice = () => {
  const totalPrice = {};
  for (let i = 0; i < itemsList.length; i++) {
    const tournament = itemsList[i].tournament;
    const price = itemsList[i].price;
    const quantity = itemsList[i].quantity;
    const spendOnBuy = itemsList[i].spendOnBuy;
    const total = (price * quantity).toFixed(2);
    const totalSpend = (spendOnBuy * quantity).toFixed(2);
    
    if (!totalPrice[tournament]) {
      totalPrice[tournament] = {
        price: 0,
        spend: 0
      };
    }
    totalPrice[tournament].price += parseFloat(total);
    totalPrice[tournament].spend += parseFloat(totalSpend);
  }
  return totalPrice;
};

const CustomTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [sortDirection, setSortDirection] = useState(null);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [openRows, setOpenRows] = useState({}); // Зберігатиме стан відкритих рядків між сторінками
  
  // Знайдіть першу валюту у списку
  const initialCurrency = itemsList.length > 0 ? itemsList[0].currency : 'USD';
  
  const [currency, setCurrency] = useState(initialCurrency) // Зберігаємо обраний тип валюти
  
  validateItemsList();
  
  const { filteredData, handleSearch, handleSort, searchTerm } = useTableFilter(createItemsData);
  
  const totalAllPrice = useMemo(() => {
    return Object.values(calculateTotalPrice()).reduce((acc, curr) => acc + curr.price, 0).toFixed(2);
  }, []);
  
  const handleSortAndUpdate = (column) => {
    handleSort(column);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setSortedColumn(column);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page, rowsPerPage]);
  
  const handleCurrency = async (event) => {
    const selectedCurrency = event.target.value;
    setCurrency(selectedCurrency);
    await handleCurrencyChange(selectedCurrency, itemsList); // Передавання itemsList
  };
  
  return (
    <Box minWidth={390}
         maxWidth={900}
         mx="auto">
      <ToastContainer/>
      <Box display="flex"
           alignItems="center"
           justifyContent="space-between"
           mb={2}>
        <TextField className="SearchField"
                   label="Search"
                   variant="outlined"
                   value={searchTerm}
                   onChange={handleSearch}/>
        
        <Stack>
          <TablePagination
            className="Pagination"
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
          />
        </Stack>
        
        <Select
          className="Currency"
          value={currency}
          onChange={handleCurrency}
          variant="outlined"
        >
          <MenuItem value="USD">USD $</MenuItem>
          <MenuItem value="Uah">Uah ₴</MenuItem>
        </Select>
        
      </Box>
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
      <RenewData />

      
      <Stack spacing={2} mt={2} alignItems="center">
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={page + 1}
          onChange={(event, value) => handleChangePage(event, value - 1)} // Відніміть 1 від value перед передачею назад
          color="primary"
          boundaryCount={1}
          siblingCount={1}
          showFirstButton // Показати кнопку "Перша сторінка"
          showLastButton // Показати кнопку "Остання сторінка"
        />
      </Stack>

      
      <Box className="TotalPrices"
           maxWidth={390}
           textAlign="center"
           sx={{fontFamily: 'RobotoFlex, sans-serif', margin: '10px auto'}}>
        {Object.entries(calculateTotalPrice()).map(([tournament, { price }]) => (
          <div key={tournament}>Total Price for {tournament}: <CountUp start={0}
                                                                       end={price.toFixed(2)}
                                                                       duration={1}
                                                                       decimals={2}/></div>
        ))}
        <div>Total Price for All: <CountUp start={0}
                                           end={totalAllPrice}
                                           duration={1}
                                           decimals={2}/></div>
        <div>Total IRL Price: <CountUp start={0}
                                       end={(totalAllPrice * IRL_MONEY)}
                                       duration={1}
                                       decimals={2}/></div>
      </Box>
      
      <SteamMarketSearch/>
    </Box>
  );
}

export default CustomTable;