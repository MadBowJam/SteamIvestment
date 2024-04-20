import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const TableHeadComponent = ({ handleSort, sortDirection, sortedColumn }) => {
  // Функція для відображення стрілки сортування для кожного стовпця
  const renderSortIcon = (column) => {
    if (sortedColumn === column) {
      return sortDirection === 'asc' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />;
    }
    return <KeyboardArrowRightIcon />;
  };
  
  return (
    <TableRow>
      <TableCell onClick={() => handleSort('tournament')}>
        Tournament {renderSortIcon('tournament')}
      </TableCell>
      <TableCell onClick={() => handleSort('name')}>
        Name {renderSortIcon('name')}
      </TableCell>
      <TableCell onClick={() => handleSort('price')}>
        Price {renderSortIcon('price')}
      </TableCell>
      <TableCell onClick={() => handleSort('quantity')}>
        Quantity {renderSortIcon('quantity')}
      </TableCell>
      <TableCell onClick={() => handleSort('total')}>
        Total {renderSortIcon('total')}
      </TableCell>
      <TableCell onClick={() => handleSort('spend_on_buy')}>
        Spend on buy {renderSortIcon('spend_on_buy')}
      </TableCell>
    </TableRow>
  );
};

export default TableHeadComponent;