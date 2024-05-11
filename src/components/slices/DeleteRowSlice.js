import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  itemToDelete: null,
};

const deleteRowSlice = createSlice({
  name: 'deleteItem',
  initialState,
  reducers: {
    setItemToDelete: (state, action) => {
      state.itemToDelete = action.payload;
    },
    clearItemToDelete: (state) => {
      state.itemToDelete = null;
    },
  },
});

export const { setItemToDelete, clearItemToDelete } = deleteRowSlice.actions;
export default deleteRowSlice.reducer;