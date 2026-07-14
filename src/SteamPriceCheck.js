// Apply patch for deprecated util._extend API
require('./util-patch');

// Load environment variables
require('dotenv').config();

const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const tinify = require("tinify");
const SteamApiClient = require('./api/SteamApiClient');
const itemsArray = require('./components/ItemList.json');

// Get the absolute path to the project root directory
const rootDir = path.resolve(__dirname, '..');

// Format current date for filename
const today = new Date().toLocaleString('en-GB', { 
  year: 'numeric', 
  month: '2-digit', 
  day: '2-digit', 
  hour: '2-digit', 
  minute: '2-digit', 
  hour12: false 
})
  .replace(/\//g, '.')
  .replace(/[,\s:]/g, '_');

// Set TinyPNG API key from environment variable
tinify.key = process.env.TINIFY_API_KEY;

// Create Steam API client with optimized configuration
const steamClient = new SteamApiClient({
  maxRetries: 10,
  initialDelay: 5000,    // Збільшуємо до 5 секунд
  minDelay: 4000,        // Мінімально 4 секунди між запитами
  maxDelay: 15000,       // Максимально до 15 секунд, якщо почне блокувати
  batchSize: 1,          // Для надійності краще обробляти по 1 предмету
  delayBetweenBatches: 5000
});

/**
 * Saves an image to disk (temporarily without TinyPNG optimization)
 * @param {Buffer} imageBuffer - The image data as a buffer
 * @param {string} imageName - The name to save the image as
 * @returns {Promise<void>}
 */
async function optimizeAndSaveImage(imageBuffer, imageName) {
  try {
    // Temporarily skip TinyPNG optimization and save the original image buffer directly
    // Original code: const optimizedImage = await tinify.fromBuffer(imageBuffer).toBuffer();
    
    // // Save image to disk without optimization
    // await fs.writeFile(path.join(rootDir, 'images', imageName), imageBuffer);

      // Save image to disk without optimization
      const imagesDir = path.join(__dirname, 'images');
      await fs.mkdir(imagesDir, { recursive: true });
      await fs.writeFile(path.join(imagesDir, imageName), imageBuffer);

    console.log(`Image saved as ${imageName} (without optimization)`);
  } catch (error) {
    console.error(`Error saving image: ${error}`);
    throw new Error(`Image saving failed: ${error.message}`);
  }
}

/**
 * Fetches price data for all items in the itemsArray and updates the JSON files
 * @returns {Promise<void>}
 */
async function fetchData() {
  try {
    console.log(`Processing ${itemsArray.length} items with optimized batch strategy`);

    // Extract item names for fetching
    const itemNames = itemsArray.map(item => item.nameForFetch);

    // Fetch data for all items using the optimized batch strategy
    console.time('Total fetch time');
    const results = await steamClient.getItemsDataOptimized(730, itemNames, 18);
    console.timeEnd('Total fetch time');

    // Create a map of results for easy lookup
    const resultMap = new Map(); results.forEach(r => { if(r.itemname) resultMap.set(r.itemname.trim(), r); }); console.log("Map keys:", Array.from(resultMap.keys())); results.forEach(r => { if(r.itemname) resultMap.set(r.itemname, r); }); console.log("Map size:", resultMap.size); console.log("API item names raw:", results.map(r => JSON.stringify(r.itemname))); console.log("JSON item names raw:", itemsArray.map(i => JSON.stringify(i.nameForFetch))); console.log("API item names:", results.map(r => `[${r.itemname}]`)); console.log("JSON item names:", itemsArray.map(i => `[${i.nameForFetch}]`)); console.log("Results from API:", results.map(r => ({name: r.itemname, success: !!r.price, error: r.error})));
    results.forEach(result => {
      if (result && result.price && !result.error) {
        resultMap.set(result.itemname || '', result);
      }
    });

    // Update the itemsArray with the fetched prices
    let updatedCount = 0;
    let errorCount = 0;

    for (const item of itemsArray) {
      const result = resultMap.get(item.nameForFetch.trim());
      console.log(`Checking ${item.nameForFetch}: result found? ${!!result}, has price? ${result && !!result.price}`);

      // 1. Перевіряємо, чи отримали ми взагалі результат та ціну для цього предмета
      if (result && result.price) {
        const priceData = result.price.lowest_price || result.price.median_price;

        if (priceData) {
          // 2. Витягуємо тільки цифри та крапку/кому, перетворюємо на число
          const numericPrice = priceData.replace(/[^\d,.]/g, '').replace(',', '.');
          item.price = Number(numericPrice);
          item.currency = "UAH";

          if (!result.price.lowest_price) {
            console.log(`Note: Using median price for ${item.nameForFetch} as lowest_price was missing.`);
          }

          // 3. Обробка зображення (якщо воно є і ще не збережене)
          if (result.image) {
            const imageName = `${item.tournament}-${item.name}.png`;
            const imagesDir = path.join(__dirname, 'images');
            const imagePath = path.join(imagesDir, imageName);

            if (!fsSync.existsSync(imagePath)) {
              console.log(`Image for ${item.name} doesn't exist. Saving it now...`);
              await optimizeAndSaveImage(result.image, imageName);
            }
          }

          updatedCount++;
        } else {
          console.error(`Price data is empty for ${item.nameForFetch}`);
          errorCount++;
        }
      } else {
        // 4. Якщо результат не знайдено або він помилковий
        const apiResult = results.find(r => r.itemname === item.nameForFetch);
        console.error(`Failed to update item: ${item.nameForFetch}. Error: ${apiResult ? apiResult.error : "No result found in resultMap"}`);
        errorCount++;
      }
    }

    console.log(`Updated ${updatedCount} items successfully`);
    console.log(`Failed to update ${errorCount} items`);

    // Write updated itemsArray with prices to files
    await fs.writeFile(path.join(rootDir, 'src', 'components', 'ItemList.json'), JSON.stringify(itemsArray, null, 2));
    await fs.writeFile(path.join(rootDir, 'src', 'json', `${today}.json`), JSON.stringify(itemsArray, null, 2));
    console.log('Files updated successfully');

  } catch (err) {
    console.error(`Fatal error in fetchData: ${err.message}`);
    throw err; // Re-throw to allow handling by the caller
  }
}

// Execute the data fetching process
fetchData()
  .then(() => console.log('Price check completed successfully'))
  .catch(error => console.error(`Price check failed: ${error.message}`));
