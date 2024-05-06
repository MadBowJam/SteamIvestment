import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
// import itemsList from "../ItemList.json";
import {calculateTotalPrice} from './Table';

// Реєстрація необхідних модулів для Chart.js
Chart.register(...registerables);

const ChartPage = () => {
  // Отримання даних для графіка з результату функції calculateTotalPrice
  const totalPriceData = calculateTotalPrice();
  const labels = Object.keys(totalPriceData); // Використовуємо ключі як мітки
  const data = Object.values(totalPriceData); // Використовуємо значення як дані
  
  // Налаштування опцій графіка
  const options = {
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
  };
  
  return (
    <div>
      <h1>Chart Page</h1>
      <div>
        <Line
          data={{
            labels: labels, // Використовуємо мітки з labels
            datasets: [
              {
                label: 'Total Sales (in USD)',
                data: data, // Використовуємо дані з total
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          }}
          options={options}
        />
      </div>
    </div>
  );
};

export default ChartPage;
