import React from 'react';
import './index.css';
import Header from './components/dom/Header';
import Table from './components/dom/Table';
import IdleTimer from './components/functions/IdleTimer'; // Імпорт компонента з IdleTimerExample.js

const App = () => {
  return (
    <div>
      <Header />
      <Table />
      <IdleTimer /> {/* Використання компонента IdleTimerExample */}
    </div>
  );
};

export default App;
