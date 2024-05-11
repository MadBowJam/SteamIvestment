import 'react-toastify/dist/ReactToastify.css';

// Функція для обробки кліку по рядку таблиці
const calculateProfit = (item) => {
  const profit = ((item.total) / item.spendOnBuy).toFixed(2);
  let profitText = `x${profit}`
  let profitColor;
  
  if (profit === 'Infinity') {
    profitText = 'Infinity'; // Якщо прибуток - Infinity
    profitColor = 'green'; // Зелений колір
  } else if (profit <= 1) {
    profitColor = 'red'; // Червоний колір
  } else {
    profitColor = 'green'; // Зелений колір
  }
  
  return { profitText, profitColor };
};

export { calculateProfit };