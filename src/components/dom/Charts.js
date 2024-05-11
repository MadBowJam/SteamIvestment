import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { calculateTotalPrice } from './Table';

// Реєстрація необхідних модулів для Chart.js
Chart.register(...registerables);

const ChartPage = () => {
  // Отримання даних для графіка з результату функції calculateTotalPrice
  const totalPriceData = calculateTotalPrice();
  const labels = Object.keys(totalPriceData); // Використовуємо ключі як мітки
  const earning = Object.values(totalPriceData).map(item => item.price); // Витягуємо значення price з кожного об'єкту
  const spent = Object.values(totalPriceData).map(item => item.spend);
  
  // Налаштування опцій графіка
  const options = {
    scales: {
      y: {
        stacked: false, // Встановлюємо опцію stacked для стекованого графіка
        type: 'linear',
        beginAtZero: true,
      },
    },
    animation: {
      duration: 2000, // Тривалість анімації у мілісекундах
      easing: 'easeInOutQuart', // Функція для плавного переходу
    },
  };
  
  return (
    <div className="ChartsWrapper">
        <Bar
          data={{
            labels: labels, // Використовуємо мітки з labels
            datasets: [
              {
                label: 'Earning', // Назва першого датасету
                data: earning, // Використовуємо дані з earning
                backgroundColor: 'rgb(75, 192, 192)',
              },
              {
                label: 'Spent', // Назва другого датасету
                data: spent, // Використовуємо дані з spent
                backgroundColor: 'rgb(255, 99, 132)',
              },
            ],
          }}
          options={options}
        />
    </div>
  );
};

export default ChartPage;