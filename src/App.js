import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/dom/Header';
import Table from './components/dom/Table';
import ChartPage from './components/dom/Charts';
import { calculateTotalPrice } from './components/dom/Table';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        {/*<Table />*/}
        <Routes>
          <Route path="/" element={<Table />} /> {/* Основна таблиця */}
          <Route path="/chart" element={<ChartPage totalPriceData={calculateTotalPrice()} />} />{/* Сторінка з графіком */}
          {/* Додайте інші маршрути тут */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
