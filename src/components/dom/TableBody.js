import React, { useState } from 'react';
import { TableBody, TableCell, TableRow, Collapse, Box } from '@mui/material';
import CountUp from 'react-countup';

const CustomTableBody = ({ filteredData }) => {
  const [openRowIndex, setOpenRowIndex] = useState(null);
  
  const handleClickOnRow = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };
  
  const calculateProfit = (item) => {
    const profit = ((item.total) / item.spend_on_buy).toFixed(2);
    let profitText = `x${profit}`
    let profitColor;
    
    if (profit === 'Infinity') {
      profitText = 'Infinity'; // Якщо прибуток - Infinity
      profitColor = 'green'; // Зелений колір
    } else if (profit <= 1) {
      profitColor = 'red'; // Червоний колір
    } else {
      profitColor = 'green'; // Зелений колір
    }
    
    return { profitText, profitColor };
  };
  
  return (
    <TableBody>
      {filteredData.map((item, index) => (
        <React.Fragment key={`${item.tournament}-${item.name}`}>
          <TableRow onClick={() => handleClickOnRow(index)}>
            <TableCell>{item.tournament}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell><CountUp start={0} end={item.price} duration={1} decimals={2} /></TableCell>
            <TableCell><CountUp start={0} end={item.quantity} duration={1} decimals={0} /></TableCell>
            <TableCell><CountUp start={0} end={item.total} duration={1} decimals={2} /></TableCell>
            <TableCell><CountUp start={0} end={item.spend_on_buy} duration={1} decimals={2} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={openRowIndex === index} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  <div>
                    Your profit:{' '}
                    <span style={{ color: calculateProfit(item).profitColor }}>
                      {calculateProfit(item).profitText}
                    </span>
                  </div>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </TableBody>
  );
};

export default CustomTableBody;
