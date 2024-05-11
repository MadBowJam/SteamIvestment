import axios from 'axios';
import { toast } from 'react-toastify';

export const updateItemsList = async (itemsList) => {
  try {
    const response = await axios.post('http://localhost:5000/update-items-list', itemsList);
    toast.success(response.data.message, { autoClose: 5000 }); // Вивести сповіщення про успішне оновлення
  } catch (error) {
    console.error('Error updating item list:', error);
    toast.error(`Error occurred`, { autoClose: 5000 }); // Вивести сповіщення про помилку
  }
};
