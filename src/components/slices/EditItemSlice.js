import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  openEditModal: false,
  editedItem: null,
  editedValues: {},
};

const EditItemSlice = createSlice({
  name: 'editItem',
  initialState,
  reducers: {
    openEditModal: (state, action) => {
      state.openEditModal = true;
      state.editedItem = action.payload.editedItem;
      state.editedValues = action.payload.editedValues;
    },
    closeEditModal: (state) => {
      state.openEditModal = false;
      state.editedItem = null;
      state.editedValues = {};
    },
    saveEditedValues: (state, action) => {
      state.openEditModal = false;
      state.editedItem = null;
      state.editedValues = {};
      // додаткова логіка для збереження редагованого елемента
    },
    handleChange: (state, action) => {
      const { name, value } = action.payload;
      state.editedValues = {
        ...state.editedValues,
        [name]: name === 'spendOnBuy' || name === 'quantity' ? parseFloat(value) : value,
      };
    },
  },
});

export const { openEditModal, closeEditModal, saveEditedValues, handleChange } = EditItemSlice.actions;

export default EditItemSlice.reducer;
