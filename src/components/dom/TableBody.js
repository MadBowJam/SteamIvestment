import React from 'react';
import { TableBody, TableCell, TableRow } from '@mui/material';
import CountUp from 'react-countup';
import handleClick from '../functions/ClickOnRow';

const CustomTableBody = ({ filteredData }) => {
  return (
    <TableBody>
      {filteredData.map((item) => (
        <TableRow key={`${item.tournament}-${item.name}`} data-index={item} onClick={() => handleClick(item)}>
          <TableCell>{item.tournament}</TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell><CountUp start={0} end={item.price} duration={1} decimals={2} /></TableCell>
          <TableCell><CountUp start={0} end={item.quantity} duration={1} decimals={2} /></TableCell>
          <TableCell><CountUp start={0} end={item.total} duration={1} decimals={2} /></TableCell>
          <TableCell><CountUp start={0} end={item.spend_on_buy} duration={1} decimals={2} /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default CustomTableBody;