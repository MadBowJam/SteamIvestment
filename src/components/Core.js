const axios = require('axios');

// Функція для отримання ціни конкретного предмета
function getprice(appid, itemname, currency) {
  return axios.get('https://steamcommunity.com/market/priceoverview', {
    params: {
      currency: currency,
      appid: appid,
      market_hash_name: itemname
    },
    timeout: 5000 // Таймаут в мілісекундах (в даному випадку 5 секунд)
  })
    .then(response => {
      if (!response.data.success) {
        throw new Error(`Request for item '${itemname}' failed.`);
      }
      return response.data;
    })
    .catch(error => {
      throw new Error(`Error occurred while fetching data for item '${itemname}': ${error}`);
    });
}

exports.getprice = getprice;

exports.getprices = (appid, itemnames, currency) => {
  return new Promise((resolve, reject) => {
    // Валідація вхідних параметрів
    if (typeof appid !== 'number' || isNaN(appid)) {
      reject('Appid must be a valid number.');
      return; // Додано return
    }
    if (typeof currency !== 'number' || isNaN(currency)) {
      reject('Currency must be a valid number.');
      return; // Додано return
    }
    if (!itemnames || (typeof itemnames !== 'string' && !Array.isArray(itemnames))) {
      reject('Itemnames must be a string or an array of strings.');
      return; // Додано return
    }
    
    // Перетворення itemnames в масив рядків, якщо вони є рядком
    const items = (typeof itemnames === 'string') ? [itemnames] : itemnames;
    
    // Масив обіцянок для зберігання результатів запитів
    const promises = items.map(itemname => {
      return getprice(appid, itemname, currency)
        .catch(error => {
          reject(error);
        });
    });
    
    // Використовуємо Promise.all для паралельного виконання запитів
    Promise.all(promises)
      .then(results => {
        resolve(results);
      })
      .catch(err => {
        reject(err);
      });
  });
}