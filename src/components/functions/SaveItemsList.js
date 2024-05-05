import axios from 'axios';
import { toast } from 'react-toastify';

export const updateItemsList = async (itemsList) => {
  try {
    const response = await axios.post('http://localhost:5000/update-items-list', itemsList);
    toast.success(response.data.message, { autoClose: 5000 });
  } catch (error) {
    console.error('Error updating item list:', error);
    // Додайте логіку обробки помилок тут
  }
};
