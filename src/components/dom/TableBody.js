import React, { useState } from 'react';
import { TableBody, TableCell, TableRow, Collapse, Box, IconButton, Modal, Button, TextField } from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';
import CountUp from 'react-countup';
import { calculateProfit } from '../functions/ClickOnRow';
import itemsList from '../ItemList.json';
import 'react-toastify/dist/ReactToastify.css';
import { updateItemsList } from '../functions/SaveItemsList';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenRow } from '../slices/OpenRowSlice';
import { setItemToDelete, clearItemToDelete } from '../slices/DeleteRowSlice';
import { openEditModal, closeEditModal, saveEditedValues, handleChange } from '../slices/EditItemSlice'; // Оновлені імпорти

const CustomTableBody = ({ filteredData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const dispatch = useDispatch();
  const openRows = useSelector(state => state.table.openRows);
  const imgSrc = useSelector(state => state.table.imgSrc);
  const itemToDelete = useSelector(state => state.deleteItem.itemToDelete);
  const editedItem = useSelector(state => state.editItem.editedItem);
  const editedValues = useSelector(state => state.editItem.editedValues);
  const openEditModalState = useSelector(state => state.editItem.openEditModal);
  
  const handleClickOnRow = (tournament, itemName) => {
    dispatch(setOpenRow({ tournament, itemName }));
  };
  
  const handleEditClick = (tournament, itemName) => {
    const edited = filteredData.find(item => item.tournament === tournament && item.name === itemName);
    dispatch(openEditModal({ editedItem: edited, editedValues: edited }));
  };
  
  const handleSaveEdit = async () => {
    // Оновлення itemsList після збереження редагованого елемента
    const updatedItemList = itemsList.map(item => {
      if (item.tournament === editedItem.tournament && item.name === editedItem.name) {
        return {
          ...item, // Збереження оригінальних значень
          ...editedValues, // Оновіть значення редагування
        };
      }
      return item;
    });
    console.log(editedValues)
    console.log(updatedItemList);
    await updateItemsList(updatedItemList);
    dispatch(saveEditedValues());
  };
  
  const handleCloseEditModal = () => {
    dispatch(closeEditModal());
  };
  
  const handleChangeLocal = (event) => {
    const { name, value } = event.target;
    dispatch(handleChange({ name, value }));
  };
  
  const handleDeleteClick = (tournament, itemName) => {
    dispatch(setItemToDelete({ tournament, itemName }));
    setIsExpanded(false);
  };
  
  const handleConfirmDelete = async () => {
    const { tournament, itemName } = itemToDelete;
    const updatedItemList = itemsList.filter(item => !(item.tournament === tournament && item.name === itemName));
    
    await updateItemsList(updatedItemList);
    dispatch(clearItemToDelete());
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
                        <Delete color="error" />
                      </IconButton>
                      <IconButton onClick={() => handleEditClick(item.tournament, item.name)}>
                        <Edit color="primary" />
                      </IconButton>
                    </div>
                  </div>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
          <Modal
            open={!!itemToDelete}
            onClose={() => dispatch(clearItemToDelete())}
            aria-labelledby="confirm-delete-modal"
            aria-describedby="confirm-delete-description"
          >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 400 }}>
              <h2 id="confirm-delete-modal">Confirm Delete</h2>
              <p id="confirm-delete-description">Are you sure you want to delete this item?</p>
              <Button onClick={handleConfirmDelete}>Yes</Button>
              <Button onClick={() => dispatch(clearItemToDelete())}>No</Button>
            </Box>
          </Modal>
          <Modal
            open={openEditModalState}
            onClose={handleCloseEditModal}
            aria-labelledby="edit-modal"
            aria-describedby="edit-description"
          >
            <Box className="EditWrapper">
              {editedItem && (
                <div className="EditItems">
                  <TextField className="EditField"
                             label="Tournament"
                             name="tournament"
                             value={editedValues.tournament || ''}
                             onChange={handleChangeLocal}
                  />
                  <TextField className="EditField"
                             label="Name"
                             name="name"
                             value={editedValues.name || ''}
                             onChange={handleChangeLocal}
                  />
                  <TextField className="EditField"
                             label="Quantity"
                             name="quantity"
                             value={editedValues.quantity || ''}
                             onChange={handleChangeLocal}
                  />
                  <TextField className="EditField"
                             label="Spend on 1 item"
                             name="spendOnBuy"
                             value={editedValues.spendOnBuy || ''}
                             onChange={handleChangeLocal}
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
