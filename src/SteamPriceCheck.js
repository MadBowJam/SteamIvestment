const steamprice = require('./components/Core.js');
const itemsArray = require('./components/ItemList.js');
const fs = require('fs').promises;
const today = new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
  .replace(/\//g, '.')
  .replace(/[,\s:]/g, '_');
const delay = 3500;

async function fetchData() {
  try {
    let results = [];
    
    for (let i = 0; i < itemsArray.itemsList.length; i++) {
      const data = await steamprice.getprice(730, itemsArray.itemsList[i], '1');
      results.push(data["lowest_price"].substring(1));
      console.log(`${i+1} complete`);
      
      // Затримка тільки між запитами, а не перед кожним
      if (i !== itemsArray.itemsList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.log('All complete');
    
    // Записуємо результати в файл
    await fs.writeFile(`./json/${today}.json`, JSON.stringify(results));
    await fs.writeFile(`./json/latest.json`, JSON.stringify(results));
  } catch (err) {
    console.log(err);
  }
}

fetchData();