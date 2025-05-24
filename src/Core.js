const axios = require('axios');

/**
 * Fetches price and image data for a specific Steam item
 * @param {number} appid - The Steam app ID (e.g., 730 for CS:GO)
 * @param {string} itemname - The name of the item to fetch
 * @param {number} currency - The currency code (e.g., 1 for USD)
 * @returns {Promise<Object>} - Object containing price and image data
 */
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
      return Promise.reject(new Error(`Request for item '${itemname}' failed.`)); // Повертаємо помилку зовні
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
    return Promise.reject(new Error(`Error occurred while fetching data for item '${itemname}': ${error}`)); // Повертаємо помилку зовні
  }
}

exports.getprice = getprice;

/**
 * Fetches price and image data for multiple Steam items
 * @param {number} appid - The Steam app ID (e.g., 730 for CS:GO)
 * @param {string|string[]} itemnames - The name(s) of the item(s) to fetch
 * @param {number} currency - The currency code (e.g., 1 for USD)
 * @returns {Promise<Object[]>} - Array of objects containing price and image data
 */
exports.getprices = async (appid, itemnames, currency) => {
  // Валідація вхідних параметрів
  if (typeof appid !== 'number' || isNaN(appid)) {
    throw new Error('Appid must be a valid number.');
  }
  if (typeof currency !== 'number' || isNaN(currency)) {
    throw new Error('Currency must be a valid number.');
  }
  if (!itemnames || (typeof itemnames !== 'string' && !Array.isArray(itemnames))) {
    throw new Error('Itemnames must be a string or an array of strings.');
  }

  // Перетворення itemnames в масив рядків, якщо вони є рядком
  const items = (typeof itemnames === 'string') ? [itemnames] : itemnames;

  try {
    // Використовуємо Promise.all для паралельного виконання запитів
    const results = await Promise.all(
      items.map(itemname => getprice(appid, itemname, currency))
    );
    return results;
  } catch (error) {
    throw new Error(`Error fetching prices: ${error.message}`);
  }
}
