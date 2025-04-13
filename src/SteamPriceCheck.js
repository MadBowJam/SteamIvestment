const steamprice = require('./Core.js');
const itemsArray = require('./components/ItemList.json');
const fs = require('fs').promises;
const axios = require('axios');
const today = new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
  .replace(/\//g, '.')
  .replace(/[,\s:]/g, '_');
const delay = 3500;

// Встановлюємо API ключ TinyPNG
const tinify = require("tinify");
tinify.key = "hVShtTHbfHHZ4r06QqGfggT4l6Z5xm45";

// Функція для оптимізації та збереження зображення
async function optimizeAndSaveImage(imageBuffer, imageName) {
  try {
    // Оптимізуємо зображення через TinyPNG
    const optimizedImage = await tinify.fromBuffer(imageBuffer).toBuffer();
    
    // Зберігаємо оптимізоване зображення на диск
    await fs.writeFile(`./images/${imageName}`, optimizedImage);
    
    console.log(`Зображення збережено як ${imageName}`);
  } catch (error) {
    console.error(`Помилка при оптимізації та збереженні зображення: ${error}`);
  }
}

// Функція для отримання даних з інтернету та обробки їх
async function fetchData() {
  try {
    console.log(itemsArray.length);
    
    // Ітеруємося по всіх елементах масиву itemsArray
    for (let i = 0; i < itemsArray.length; i++) {
      const item = itemsArray[i];
      
      // Отримуємо ціни з інтернету
      const { price } = (await steamprice.getprice(730, item.nameForFetch, '1'));
      
      try {
        // // Отримуємо зображення з інтернету
        const { data: imageBuffer } = await axios.get(`https://api.steamapis.com/image/item/730/${encodeURIComponent(item.nameForFetch)}`, {
          responseType: 'arraybuffer'
        });

        // Зберігаємо та оптимізуємо зображення
        const imageName = `${item.tournament}-${item.name}.png`;
        await optimizeAndSaveImage(imageBuffer, imageName);

        // Оновлюємо об'єкт елементу в itemsArray, додаючи ключ "price"
        item.price = Number(price.lowest_price.substring(1));
        item.currency = "USD";
        
        console.log(`${i + 1} complete`);
      } catch (error) {
        // Обробляємо помилки під час обробки зображення
        if (error.response && error.response.status === 429) {
          console.error(`Отримано помилку 429 Too Many Requests для ${item.nameForFetch}. Продовжуємо виконання...`);
        } else {
          console.error(`Помилка при обробці ${item.nameForFetch}: ${error.message}`);
        }
        
        // Використовуємо return, щоб зупинити виконання в разі помилки
        return;
      }
      
      // Затримка тільки між запитами, а не перед кожним
      if (i !== itemsArray.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.log('All complete');
    
    // Записуємо оновлений itemsArray з цінами у файл
    await fs.writeFile('./components/ItemList.json', JSON.stringify(itemsArray));
    await fs.writeFile(`./json/${today}.json`, JSON.stringify(itemsArray));
    
  } catch (err) {
    console.error(`Помилка: ${err.message}`);
  }
}

// Викликаємо функцію для отримання даних
fetchData();