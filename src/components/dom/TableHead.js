import React from 'react';
import { TableCell, TableRow } from '@mui/material';

const TableHead = ({ handleSort }) => {
  return (
    <TableRow>
      <TableCell onClick={() => handleSort('tournament')}>Tournament</TableCell>
      <TableCell onClick={() => handleSort('name')}>Name</TableCell>
      <TableCell onClick={() => handleSort('price')}>Price</TableCell>
      <TableCell onClick={() => handleSort('quantity')}>Quantity</TableCell>
      <TableCell onClick={() => handleSort('total')}>Total</TableCell>
      <TableCell onClick={() => handleSort('spend_on_buy')}>Spend on buy</TableCell>
    </TableRow>
  );
}

export default TableHead;