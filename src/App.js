import React, { useState, useCallback } from 'react';
import './index.css';
import Header from './components/dom/Header';
import Table from './components/dom/Table';

const App = () => {
  
  const [count, setCount] = useState(0);
  
  // Мемоізована колбек-функція для збільшення лічильника
  const increment = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // Пустий масив залежностей означає, що функція не залежить від зовнішніх змінних

  return (
    <div>
      <Header/>
      <Table/>
      
      <p className="homework">Count: {count}</p>
      {/* Кнопка, що викликає функцію збільшення */}
      <button className="homework" onClick={increment}>Increment</button>
    </div>
  
  
  )
    ;
}

export default App;