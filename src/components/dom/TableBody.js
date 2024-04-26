import React, { useState } from 'react';
import { TableBody, TableCell, TableRow, Collapse, Box } from '@mui/material';
import CountUp from 'react-countup';
import { calculateProfit } from '../functions/ClickOnRow'; // Імпорт функції

function importAllImages(r) {
  const images = {};
  r.keys().forEach((key) => {
    images[key] = r(key);
  });
  return images;
}

const images = importAllImages(require.context('../../images/', false, /\.(png|jpe?g|svg)$/));
const imagesValues = Object.values(images);
const imagesKeys = Object.keys(images).map(key => key.slice(2, -4));

const CustomTableBody = ({ filteredData }) => {
  const [openRows, setOpenRows] = useState({});
  const [imgSrc, setImgSrc] = useState(null); // Стан для збереження URL зображення
  
  const imgURL = (tournament, itemName) => {
    const key = `${tournament}-${itemName}`;
    const index = imagesKeys.indexOf(key);
    if (index !== -1) {
      setImgSrc(imagesValues[index]);
    }
  };
  
  const handleClickOnRow = (tournament, itemName) => {
    setOpenRows(prevState => {
      const newOpenRows = {};
      Object.keys(prevState).forEach(key => {
        const [prevTournament, prevName] = key.split('-');
        if (prevTournament !== tournament || prevName !== itemName) {
          newOpenRows[key] = false;
        }
      });
      const newRowKey = `${tournament}-${itemName}`;
      newOpenRows[newRowKey] = !prevState[newRowKey];
      imgURL(tournament, itemName);
      return newOpenRows;
    });
  };
  
  return (
    <TableBody>
      {filteredData.map((item) => (
        <React.Fragment key={`${item.tournament}-${item.name}`}>
          <TableRow onClick={() => handleClickOnRow(item.tournament, item.name)}>
            <TableCell>{item.tournament}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell><CountUp start={0} end={item.price} duration={1} decimals={2} /></TableCell>
            <TableCell><CountUp start={0} end={item.quantity} duration={2} decimals={0} /></TableCell>
            <TableCell><CountUp start={0} end={item.total} duration={1} decimals={2} /></TableCell>
            <TableCell><CountUp start={0} end={item.spend_on_buy} duration={1} decimals={2} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={openRows[`${item.tournament}-${item.name}`]} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  <div className="CollapseInner">
                    {imgSrc && <img src={imgSrc} alt={`${item.tournament}-${item.name}`} className="ItemImage" />}
                    <span className="ItemDescription">
                      Your profit:{' '}
                      <span style={{color: calculateProfit(item).profitColor}}>
                        {calculateProfit(item).profitText}
                      </span>
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
