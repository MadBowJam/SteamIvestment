// Apply patch for deprecated util._extend API
require('./util-patch');

// Load environment variables
require('dotenv').config();

const path = require('path');
const steamprice = require('./Core.js');
const itemsArray = require('./components/ItemList.json');
const fs = require('fs').promises;
const axios = require('axios');
const tinify = require("tinify");

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

// Delay between API requests to avoid rate limiting (in milliseconds)
const delay = 3500;

// Set TinyPNG API key from environment variable
tinify.key = process.env.TINIFY_API_KEY;

/**
 * Optimizes an image using TinyPNG API and saves it to disk
 * @param {Buffer} imageBuffer - The image data as a buffer
 * @param {string} imageName - The name to save the image as
 * @returns {Promise<void>}
 */
async function optimizeAndSaveImage(imageBuffer, imageName) {
  try {
    // Optimize image using TinyPNG
    const optimizedImage = await tinify.fromBuffer(imageBuffer).toBuffer();

    // Save optimized image to disk
    await fs.writeFile(path.join(rootDir, 'images', imageName), optimizedImage);

    console.log(`Image saved as ${imageName}`);
  } catch (error) {
    console.error(`Error optimizing and saving image: ${error}`);
    throw new Error(`Image optimization failed: ${error.message}`);
  }
}

/**
 * Fetches price data for all items in the itemsArray and updates the JSON files
 * @returns {Promise<void>}
 */
async function fetchData() {
  try {
    console.log(`Processing ${itemsArray.length} items`);

    // Iterate through all items in itemsArray
    for (let i = 0; i < itemsArray.length; i++) {
      const item = itemsArray[i];

      try {
        // Fetch price data from Steam API
        const { price } = (await steamprice.getprice(730, item.nameForFetch, '1'));

        // Uncomment this block to enable image fetching and optimization
        /*
        // Fetch image from Steam API
        const { data: imageBuffer } = await axios.get(
          `https://api.steamapis.com/image/item/730/${encodeURIComponent(item.nameForFetch)}`, 
          { responseType: 'arraybuffer' }
        );

        // Save and optimize image
        const imageName = `${item.tournament}-${item.name}.png`;
        await optimizeAndSaveImage(imageBuffer, imageName);
        */

        // Update the item object with price data
        item.price = Number(price.lowest_price.substring(1));
        item.currency = "USD";

        console.log(`Item ${i + 1}/${itemsArray.length} complete: ${item.name}`);
      } catch (error) {
        // Handle errors during processing
        if (error.response && error.response.status === 429) {
          console.error(`Received 429 Too Many Requests error for ${item.nameForFetch}. Continuing execution...`);
        } else {
          console.error(`Error processing ${item.nameForFetch}: ${error.message}`);
        }

        // Continue with the next item instead of stopping execution
        console.log(`Skipping item ${item.nameForFetch} due to error`);
      }

      // Add delay between requests to avoid rate limiting
      if (i !== itemsArray.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log('All items processed successfully');

    // Write updated itemsArray with prices to files
    await fs.writeFile(path.join(rootDir, 'src', 'components', 'ItemList.json'), JSON.stringify(itemsArray, null, 2));
    await fs.writeFile(path.join(rootDir, 'src', 'json', `${today}.json`), JSON.stringify(itemsArray, null, 2));
    console.log('Files updated successfully');

  } catch (err) {
    console.error(`Fatal error in fetchData: ${err.message}`);
    throw err; // Re-throw to allow handling by the caller
  }
}

// Викликаємо функцію для отримання даних
fetchData();
