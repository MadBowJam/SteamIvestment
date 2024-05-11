import { createSlice } from '@reduxjs/toolkit';

function importAllImages(r) {
  const images = {};
  r.keys().forEach((key) => {
    images[key] = r(key);
  });
  return images;
}

const images = importAllImages(require.context('../../images', false, /\.(png|jpe?g|svg)$/));
const imagesValues = Object.values(images);
const imagesKeys = Object.keys(images).map(key => key.slice(2, -4));

const initialState = {
  openRows: {}, // Об'єкт для зберігання стану відкритих рядків
  lastOpenedRow: null, // Зберігатиме останній відкритий рядок
  imgSrc: null, // Шлях до зображення
  images,
  imagesValues,
  imagesKeys,
};

const openRowSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setOpenRow: (state, action) => {
      const { tournament, itemName } = action.payload;
      const key = `${tournament}-${itemName}`;
      
      // Закриваємо всі інші рядки, окрім поточного
      Object.keys(state.openRows).forEach(rowKey => {
        if (rowKey !== key) {
          state.openRows[rowKey] = false;
        }
      });
      
      // Встановлюємо статус відкритості поточного рядка
      state.openRows[key] = !state.openRows[key];
      state.lastOpenedRow = key; // Оновлюємо останній відкритий рядок
      
      // Встановлюємо шлях до зображення для поточного рядка
      const index = state.imagesKeys.indexOf(key);
      if (index !== -1) {
        state.imgSrc = state.imagesValues[index];
      } else {
        state.imgSrc = null;
      }
    },
  },
});

export const { setOpenRow } = openRowSlice.actions;
export default openRowSlice.reducer;