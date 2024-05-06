import React, { useState } from 'react';
import { TableBody, TableCell, TableRow, Collapse, Box, IconButton, Modal, Button, TextField } from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material'; // Імпорт іконок Delete, Edit і Save
import CountUp from 'react-countup';
import { calculateProfit } from '../functions/ClickOnRow'; // Імпорт функції
import itemsList from '../ItemList.json';
import 'react-toastify/dist/ReactToastify.css'; // Імпортуємо стилі для Toastify
import { updateItemsList } from '../functions/SaveItemsList'; // Імпорт функції

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Стан для збереження елемента, який буде видалено
  const [editedItem, setEditedItem] = useState(null); // Стан для збереження редагованого елемента
  const [editedValues, setEditedValues] = useState({}); // Стан для збереження редагованих значень
  const [openEditModal, setOpenEditModal] = useState(false);
  
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
  
  const handleEditClick = (tournament, itemName) => {
    const edited = filteredData.find(item => item.tournament === tournament && item.name === itemName);
    setEditedItem(edited);
    setEditedValues(edited); // Зберегти значення редагованого елемента в стані редагування
    setOpenEditModal(true);
  };
  
  const handleSaveEdit = async () => {
    // Логіка збереження редагованого елемента
    setOpenEditModal(false);
    
    const updatedItemList = itemsList.map(item => {
      if (item.tournament === editedItem.tournament && item.name === editedItem.name) {
        return {
          ...item, // Збереження оригінальних значень
          ...editedValues, // Оновіть значення редагування
        };
      }
      return item;
    });
    
    await updateItemsList(updatedItemList);
    setEditedItem(null);
    setEditedValues({}); // Скинути значення редагованого елемента після збереження
  };
  
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditedItem(null);
    setEditedValues({});
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedValues(prevState => ({
      ...prevState,
      [name]: name === 'spendOnBuy' || name === 'quantity' ? parseFloat(value) : value,
    }));
  };

  
  const handleDeleteClick = (tournament, itemName) => {
    setItemToDelete({ tournament, itemName });
    setIsExpanded(false); // Закрити вікно підтвердження видалення
  };
  
  const handleConfirmDelete = async () => {
    const { tournament, itemName } = itemToDelete;
    console.log(`Deleting row with tournament: ${tournament} and item name: ${itemName}`);
    // Оновлення itemList: фільтрація та видалення елемента
    const updatedItemList = itemsList.filter(item => !(item.tournament === tournament && item.name === itemName));
    console.log(updatedItemList);
    
    await updateItemsList(updatedItemList);
    setItemToDelete(null); // Скидання стану елемента для видалення
  };
  
  const collapseStyles = {
    height: isExpanded ? '0' : '150px',
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
            <TableCell><CountUp start={0} end={item.spendOnBuy} duration={1} decimals={2} /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={openRows[`${item.tournament}-${item.name}`]} timeout="auto" unmountOnExit>
                <Box margin={1}>
                  <div className="CollapseInner"  style={collapseStyles}>
                    {imgSrc && <img src={imgSrc} alt={`${item.tournament}-${item.name}`} className="ItemImage" />}
                    <span className="ItemDescription">
                      Your profit:{' '}
                      <span style={{color: calculateProfit(item).profitColor}}>
                        {calculateProfit(item).profitText}
                      </span>
                    </span>
                    <div className="IconsInRow">
                      <IconButton onClick={() => handleDeleteClick(item.tournament, item.name)}>
                        <Delete color="error" /> {/* Іконка Delete */}
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(item.tournament, item.name)}>
                        <Edit color="primary" /> {/* Іконка Edit */}
                      </IconButton>
                    </div>
                  </div>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
          {/* Модальне вікно для підтвердження видалення */}
          <Modal
            className="ModalBody"
            open={!!itemToDelete}
            onClose={() => setItemToDelete(null)}
            aria-labelledby="confirm-delete-modal"
            aria-describedby="confirm-delete-description"
          >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
              <h2 id="confirm-delete-modal">Confirm Delete</h2>
              <p id="confirm-delete-description">Are you sure you want to delete this item?</p>
              <Button onClick={handleConfirmDelete}>Yes</Button>
              <Button onClick={() => setItemToDelete(null)}>No</Button>
            </Box>
          </Modal>
          {/* Модальне вікно для редагування */}
          <Modal
            open={openEditModal}
            onClose={handleCloseEditModal}
            aria-labelledby="edit-modal"
            aria-describedby="edit-description"
          >
            {/* Вміст модального вікна */}
            <Box className="EditWrapper">
              {editedItem && (
                <div className="EditItems">
                  <TextField className="EditField"
                    label="Tournament"
                    name="tournament"
                    value={editedValues.tournament || ''}
                    onChange={handleChange}
                  />
                  <TextField className="EditField"
                    label="Name"
                    name="name"
                    value={editedValues.name || ''}
                    onChange={handleChange}
                  />
                  <TextField className="EditField"
                    label="Quantity"
                    name="quantity"
                    value={editedValues.quantity || ''}
                    onChange={handleChange}
                  />
                  <TextField className="EditField"
                    label="Spend on 1 item"
                    name="spendOnBuy"
                    value={editedValues.spendOnBuy || ''}
                    onChange={handleChange}
                  />
                  <IconButton onClick={handleSaveEdit}>
                    <Save color="primary" />
                  </IconButton>
                </div>
              )}
            </Box>
          </Modal>
        </React.Fragment>
      ))}
    </TableBody>
  );
};

export default CustomTableBody;