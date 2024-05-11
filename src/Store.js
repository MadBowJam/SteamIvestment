import { configureStore } from '@reduxjs/toolkit';
import openRowSlice from './components/slices/OpenRowSlice'; // Імпортуємо редуктор з вашого tableSlice
import deleteItemReducer from './components/slices/DeleteRowSlice';
import editItemReducer from './components/slices/EditItemSlice';

const store = configureStore({
  reducer: {
    table: openRowSlice,
    deleteItem: deleteItemReducer,
    editItem: editItemReducer,
  },
});

export default store;
