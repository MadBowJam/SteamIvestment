let request = require('request');

exports.getprice = (appid, itemname, currency) => {
  return new Promise((resolve, reject) => {
    if (typeof currency !== 'number') {
      currency = 1;
    }
    
    request({
      uri: '/market/priceoverview',
      baseUrl: 'https://steamcommunity.com/',
      json: true,
      qs: {
        currency: currency,
        appid: appid,
        market_hash_name: itemname
      }
    }, (err, res) => {
      if(err) reject(err);
      if(res.body.success === false) reject(`Request wasn't successful. Try checking your variables. Message: ${JSON.stringify(body)}`);
      resolve(res.body);
    });
  })
}

exports.getprices = (appid, itemnames, currency) => {
  return new Promise((resolve, reject) => {
    // Валідація вхідних параметрів
    if (typeof appid !== 'number' || isNaN(appid)) {
      reject('Appid must be a valid number.');
      return;
    }
    if (typeof currency !== 'number' || isNaN(currency)) {
      reject('Currency must be a valid number.');
      return;
    }
    if (!itemnames || (typeof itemnames !== 'string' && !Array.isArray(itemnames))) {
      reject('Itemnames must be a string or an array of strings.');
      return;
    }
    
    // Перетворення itemnames в масив рядків, якщо вони є рядком
    if (typeof itemnames === 'string') {
      itemnames = [itemnames];
    }
    
    // Масив обіцянок для зберігання результатів запитів
    let promises = itemnames.map(itemname => {
      return new Promise((resolve, reject) => {
        request({
          uri: '/market/priceoverview',
          baseUrl: 'https://steamcommunity.com/',
          json: true,
          qs: {
            currency: currency,
            appid: appid,
            market_hash_name: itemname
          }
        }, (err, res, body) => {
          if (err) {
            reject(`Error occurred while fetching data for item '${itemname}': ${err}`);
            return;
          }
          
          if (res.statusCode !== 200 || !body || !body.success) {
            reject(`Request for item '${itemname}' failed.`);
            return;
          }
          
          resolve(body);
        });
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