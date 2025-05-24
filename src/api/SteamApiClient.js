/**
 * Steam API Client
 * A dedicated client for interacting with Steam APIs with proper error handling and retries
 */

const axios = require('axios');

class SteamApiClient {
  /**
   * Creates a new SteamApiClient instance
   * @param {Object} options - Configuration options
   * @param {number} options.maxRetries - Maximum number of retry attempts (default: 3)
   * @param {number} options.retryDelay - Delay between retries in milliseconds (default: 1000)
   * @param {number} options.timeout - Request timeout in milliseconds (default: 5000)
   */
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.timeout = options.timeout || 5000;
    
    // Create axios instance with default configuration
    this.client = axios.create({
      timeout: this.timeout
    });
  }

  /**
   * Fetches price data for a specific Steam item
   * @param {number} appid - The Steam app ID (e.g., 730 for CS:GO)
   * @param {string} itemname - The name of the item to fetch
   * @param {number} currency - The currency code (e.g., 1 for USD)
   * @param {number} retryCount - Current retry attempt (used internally)
   * @returns {Promise<Object>} - Price data object
   */
  async getItemPrice(appid, itemname, currency, retryCount = 0) {
    try {
      const response = await this.client.get('https://steamcommunity.com/market/priceoverview', {
        params: {
          currency: currency,
          appid: appid,
          market_hash_name: itemname
        }
      });

      if (!response.data.success) {
        throw new Error(`Request for item '${itemname}' failed.`);
      }

      return response.data;
    } catch (error) {
      // Handle rate limiting (HTTP 429)
      if (error.response && error.response.status === 429 && retryCount < this.maxRetries) {
        console.warn(`Rate limited when fetching ${itemname}. Retrying in ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.getItemPrice(appid, itemname, currency, retryCount + 1);
      }
      
      // Handle other errors or max retries reached
      throw new Error(`Error fetching price for '${itemname}': ${error.message}`);
    }
  }

  /**
   * Fetches image data for a specific Steam item
   * @param {number} appid - The Steam app ID (e.g., 730 for CS:GO)
   * @param {string} itemname - The name of the item to fetch
   * @param {number} retryCount - Current retry attempt (used internally)
   * @returns {Promise<Buffer>} - Image data as buffer
   */
  async getItemImage(appid, itemname, retryCount = 0) {
    try {
      const encodedItemName = encodeURIComponent(itemname);
      const response = await this.client.get(
        `https://api.steamapis.com/image/item/${appid}/${encodedItemName}`,
        { responseType: 'arraybuffer' }
      );
      
      return response.data;
    } catch (error) {
      // Handle rate limiting (HTTP 429)
      if (error.response && error.response.status === 429 && retryCount < this.maxRetries) {
        console.warn(`Rate limited when fetching image for ${itemname}. Retrying in ${this.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.getItemImage(appid, itemname, retryCount + 1);
      }
      
      // Handle other errors or max retries reached
      throw new Error(`Error fetching image for '${itemname}': ${error.message}`);
    }
  }

  /**
   * Fetches both price and image data for a specific Steam item
   * @param {number} appid - The Steam app ID (e.g., 730 for CS:GO)
   * @param {string} itemname - The name of the item to fetch
   * @param {number} currency - The currency code (e.g., 1 for USD)
   * @returns {Promise<Object>} - Object containing price and image data
   */
  async getItemData(appid, itemname, currency) {
    try {
      // Fetch price and image in parallel
      const [price, image] = await Promise.all([
        this.getItemPrice(appid, itemname, currency),
        this.getItemImage(appid, itemname)
      ]);
      
      return { price, image };
    } catch (error) {
      throw new Error(`Error fetching data for '${itemname}': ${error.message}`);
    }
  }

  /**
   * Fetches data for multiple Steam items
   * @param {number} appid - The Steam app ID (e.g., 730 for CS:GO)
   * @param {string[]} itemnames - Array of item names to fetch
   * @param {number} currency - The currency code (e.g., 1 for USD)
   * @param {number} delayBetweenRequests - Delay between requests in milliseconds (default: 1000)
   * @returns {Promise<Object[]>} - Array of objects containing price and image data
   */
  async getItemsData(appid, itemnames, currency, delayBetweenRequests = 1000) {
    // Validate input parameters
    if (typeof appid !== 'number' || isNaN(appid)) {
      throw new Error('Appid must be a valid number.');
    }
    if (typeof currency !== 'number' || isNaN(currency)) {
      throw new Error('Currency must be a valid number.');
    }
    if (!Array.isArray(itemnames) || itemnames.length === 0) {
      throw new Error('Itemnames must be a non-empty array of strings.');
    }

    const results = [];
    
    // Process items sequentially with delay to avoid rate limiting
    for (let i = 0; i < itemnames.length; i++) {
      try {
        const itemData = await this.getItemData(appid, itemnames[i], currency);
        results.push(itemData);
        
        // Add delay between requests (except after the last one)
        if (i < itemnames.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
        }
      } catch (error) {
        console.error(`Error processing item ${itemnames[i]}: ${error.message}`);
        // Continue with next item instead of failing the whole batch
      }
    }
    
    return results;
  }
}

module.exports = SteamApiClient;