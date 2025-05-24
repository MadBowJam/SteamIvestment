/**
 * Example of refactored SteamPriceCheck.js using the SteamApiClient
 */

// Load environment variables
require('dotenv').config();

const fs = require('fs').promises;
const tinify = require("tinify");
const SteamApiClient = require('../api/SteamApiClient');
const itemsArray = require('../components/ItemList.json');

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

// Create Steam API client with custom configuration
const steamClient = new SteamApiClient({
  maxRetries: 3,
  retryDelay: 2000,
  timeout: 10000
});

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
    await fs.writeFile(`./src/images/${imageName}`, optimizedImage);

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
    
    // Extract item names for fetching
    const itemNames = itemsArray.map(item => item.nameForFetch);
    
    // Fetch data for all items with a 3.5 second delay between requests
    const results = await steamClient.getItemsData(730, itemNames, 1, 3500);
    
    // Update the itemsArray with the fetched prices
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const item = itemsArray[i];
      
      if (result && result.price) {
        // Update price data
        item.price = Number(result.price.lowest_price.substring(1));
        item.currency = "USD";
        
        // Uncomment to enable image saving
        /*
        if (result.image) {
          const imageName = `${item.tournament}-${item.name}.png`;
          await optimizeAndSaveImage(result.image, imageName);
        }
        */
        
        console.log(`Item ${i + 1}/${itemsArray.length} updated: ${item.name}`);
      }
    }
    
    console.log('All items processed successfully');

    // Write updated itemsArray with prices to files
    await fs.writeFile('./src/components/ItemList.json', JSON.stringify(itemsArray, null, 2));
    await fs.writeFile(`./src/json/${today}.json`, JSON.stringify(itemsArray, null, 2));
    console.log('Files updated successfully');

  } catch (err) {
    console.error(`Fatal error in fetchData: ${err.message}`);
    throw err;
  }
}

// Execute the data fetching process
fetchData()
  .then(() => console.log('Price check completed successfully'))
  .catch(error => console.error(`Price check failed: ${error.message}`));