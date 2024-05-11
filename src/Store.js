import { configureStore } from '@reduxjs/toolkit';
import openRowSlice from './components/slices/OpenRowSlice'; // Імпортуємо редуктор з вашого tableSlice
import deleteItemReducer from './components/slices/DeleteRowSlice';
import editItemReducer from './components/slices/EditItemSlice';

const store = configureStore({
  reducer: {
    table: openRowSlice, // Додаємо ваш редуктор до кореневого редуктора
    deleteItem: deleteItemReducer,
    editItem: editItemReducer,
    // Інші редуктори, якщо вони є
  },
});

export default store;
