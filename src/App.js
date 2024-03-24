import React, { useState, useEffect } from 'react';
import Header from './components/dom/Header';
import Table from './components/dom/Table';
import './App.css';

const App = () => {
  // стан для збереження отриманих даних
  const [data, setData] = useState([]);
  
  // викликаємо fetch для отримання даних після завантаження компоненту
  useEffect(() => {
    fetch('./json/24.03.2024__14_31.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching JSON:', error));
  }, []); // пустий масив дозволяє викликати useEffect лише після першого рендеру
  
  return (
    <div>
      <Header />
      <Table data={data} />
    </div>
  );
}

export default App;

//
// function App() {
//   const [results, setResults] = useState([]);
//   const delay = 5000;
//
//   useEffect(() => {
//     const fetchPrices = async () => {
//       let newResults = [];
//       const steamprice = new SteamPriceAPI();
//
//       const today = new Date().toLocaleString('en-GB', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false
//       }).replace(/\//g, '.').replace(/[,\s:]/g, '_');
//
//       for (let i = 0; i < itemsArray.itemsList.length; i++) {
//         await new Promise(resolve => setTimeout(resolve, delay * i));
//         try {
//           const data = await steamprice.getprice(730, itemsArray.itemsList[i], '1');
//           newResults.push(data["lowest_price"].substring(1));
//           console.log(`${i+1} complete`);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//
//       setResults(newResults);
//
//       setTimeout(() => {
//         fs.writeFile(`json/${today}.json`, JSON.stringify(newResults), function(err) {
//           if (err) throw err;
//           console.log('All complete');
//         });
//       }, delay * itemsArray.itemsList.length);
//     };
//
//     fetchPrices();
//   }, []);
//
//   return (
//     <div>
//       <h1>Результати:</h1>
//       <ul>
//         {results.map((result, index) => (
//           <li key={index}>{result}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
//
// export default App;
