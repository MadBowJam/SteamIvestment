const axios = require('axios');
const crypto = require('crypto');

function hashString(str) {
  return crypto.createHash('md5').update(str).digest("hex");
}

// Функція для отримання ціни конкретного предмета
async function getprice(appid, itemname, currency) {
  try {
    const encodedItemName = encodeURIComponent(itemname); // Кодуємо itemname
    
    // Запит на отримання ціни предмету
    const priceResponse = await axios.get('https://steamcommunity.com/market/priceoverview', {
      params: {
        currency: currency,
        appid: appid,
        market_hash_name: itemname // Використовуємо закодований itemname
      },
      timeout: 5000
    });
    
    if (!priceResponse.data.success) {
      throw new Error(`Request for item '${itemname}' failed.`);
    }
    
    // Запит на отримання зображення предмету
    const imageResponse = await axios.get(`https://api.steamapis.com/image/item/${appid}/${encodedItemName}`, {
      responseType: 'arraybuffer' // Установлюємо тип відповіді як arraybuffer для отримання даних у бінарному форматі
    });
    
    return {
      price: priceResponse.data,
      image: imageResponse.data
    };
  } catch (error) {
    throw new Error(`Error occurred while fetching data for item '${itemname}': ${error}`);
  }
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