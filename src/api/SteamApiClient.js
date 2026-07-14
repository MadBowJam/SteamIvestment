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
   * @param {number} options.initialDelay - Initial delay between requests in milliseconds (default: 3500)
   * @param {number} options.minDelay - Minimum delay between requests in milliseconds (default: 2800)
   * @param {number} options.maxDelay - Maximum delay between requests in milliseconds (default: 5000)
   * @param {number} options.batchSize - Number of items to process in a batch (default: 10)
   * @param {number} options.delayBetweenBatches - Delay between batches in milliseconds (default: 5000)
   */
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    this.timeout = options.timeout || 5000;
    this.initialDelay = options.initialDelay || 3500;
    this.minDelay = options.minDelay || 2800;
    this.maxDelay = options.maxDelay || 5000;
    this.batchSize = options.batchSize || 10;
    this.delayBetweenBatches = options.delayBetweenBatches || 5000;

    // Create axios instance with default configuration
    this.client = axios.create({
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://steamcommunity.com/market/',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'Connection': 'keep-alive'
      }
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

      console.log(`API Response for ${itemname}:`, response.data); return response.data;
    } catch (error) {
      // Handle rate limiting (HTTP 429)
      // if (error.response && error.response.status === 429 && retryCount < this.maxRetries) {
      //   console.warn(`Rate limited when fetching ${itemname}. Retrying in ${this.retryDelay}ms...`);
      //   await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      //   return this.getItemPrice(appid, itemname, currency, retryCount + 1);
      // }

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
      const price = await this.getItemPrice(appid, itemname, currency);
      let image = null;
      try {
        image = await this.getItemImage(appid, itemname);
      } catch (imgError) {
        console.warn(`Could not fetch image for ${itemname}: ${imgError.message}`);
      }
      return { price, image, itemname };
    } catch (error) {
      throw new Error(`Error fetching data for '${itemname}': ${error.message}`);
    }
  }

  /**
   * Adds jitter to a delay value to avoid synchronized requests
   * @param {number} baseDelay - The base delay in milliseconds
   * @param {number} jitterFactor - The maximum percentage of jitter to add (0-1)
   * @returns {number} - The delay with jitter added
   * @private
   */
  _getDelayWithJitter(baseDelay, jitterFactor = 0.2) {
    // Add random jitter (±jitterFactor%) to avoid synchronized requests
    const jitterAmount = baseDelay * jitterFactor;
    const jitter = Math.random() * jitterAmount * 2 - jitterAmount; // Random value between -jitterAmount and +jitterAmount
    return Math.max(this.minDelay, Math.min(this.maxDelay, baseDelay + jitter));
  }

  /**
   * Processes a batch of items with adaptive delay
   * @param {number} appid - The Steam app ID
   * @param {string[]} batch - Array of item names in the batch
   * @param {number} currency - The currency code
   * @param {number} currentDelay - Current delay between requests
   * @returns {Promise<{results: Object[], newDelay: number}>} - Results and updated delay
   * @private
   */
  async _processBatchWithAdaptiveDelay(appid, batch, currency, currentDelay) {
    const batchResults = [];
    let newDelay = currentDelay;
    let consecutiveSuccesses = 0;
    let rateLimitHits = 0;

    for (let i = 0; i < batch.length; i++) {
      const itemname = batch[i];
      let retryAttemptsPerItem = 0;
      const maxRetriesPerItem = 5;
      
      while (retryAttemptsPerItem < maxRetriesPerItem) {
        const delayWithJitter = this._getDelayWithJitter(newDelay);

        try {
          if (i > 0 || retryAttemptsPerItem > 0) {
            await new Promise(resolve => setTimeout(resolve, delayWithJitter));
          }

          const itemData = await this.getItemData(appid, itemname, currency);
          batchResults.push(itemData);
          consecutiveSuccesses++;

          if (consecutiveSuccesses >= 5) {
            newDelay = Math.max(this.minDelay, newDelay - 50);
            consecutiveSuccesses = 0;
            console.log("Reducing delay to " + newDelay + "ms after consecutive successes");
          }
          break;
        } catch (error) {
          if (error.message.includes("429") || error.message.toLowerCase().includes("rate limit")) {
            rateLimitHits++;
            retryAttemptsPerItem++;
            const increase = 200 * rateLimitHits;
            newDelay = Math.min(this.maxDelay, newDelay + increase);
            console.warn("Rate limit hit for " + itemname + " (Attempt " + retryAttemptsPerItem + "/" + maxRetriesPerItem + "). Increasing delay to " + newDelay + "ms");
            await new Promise(resolve => setTimeout(resolve, 2000));
            consecutiveSuccesses = 0;
            
            if (retryAttemptsPerItem >= maxRetriesPerItem) {
              console.error("Skipping " + itemname + " after " + maxRetriesPerItem + " failed attempts due to rate limiting.");
              batchResults.push({ itemname, error: "Max retries reached due to rate limiting" });
              break;
            }
          } else {
            console.error("Error processing item " + itemname + ": " + error.message);
            batchResults.push({ itemname, error: error.message });
            break;
          }
        }
      }
    }
    return { results: batchResults, newDelay };
  }

  /**
   * Fetches data for multiple Steam items using an optimized batch strategy
   * @param {number} appid - The Steam app ID (e.g., 730 for CS:GO)
   * @param {string[]} itemnames - Array of item names to fetch
   * @param {number} currency - The currency code (e.g., 1 for USD)
   * @param {number} initialDelay - Initial delay between requests in milliseconds (overrides constructor setting)
   * @returns {Promise<Object[]>} - Array of objects containing price and image data
   */
  async getItemsDataOptimized(appid, itemnames, currency, initialDelay = null) {
    if (typeof appid !== 'number' || isNaN(appid)) {
      throw new Error('Appid must be a valid number.');
    }
    if (typeof currency !== 'number' || isNaN(currency)) {
      throw new Error('Currency must be a valid number.');
    }
    if (!Array.isArray(itemnames) || itemnames.length === 0) {
      throw new Error('Itemnames must be a non-empty array of strings.');
    }

    const startingDelay = initialDelay || this.initialDelay;
    const batches = [];
    for (let i = 0; i < itemnames.length; i += this.batchSize) {
      batches.push(itemnames.slice(i, i + this.batchSize));
    }

    console.log("Processing " + itemnames.length + " items in " + batches.length + " batches of up to " + this.batchSize + " items each");

    const allResults = [];
    let currentDelay = startingDelay;

    for (let i = 0; i < batches.length; i++) {
      console.log("Processing batch " + (i + 1) + "/" + batches.length + " with delay " + currentDelay + "ms");
      const { results, newDelay } = await this._processBatchWithAdaptiveDelay(appid, batches[i], currency, currentDelay);
      allResults.push(...results);
      currentDelay = newDelay;

      if (i < batches.length - 1) {
        const batchPauseWithJitter = this._getDelayWithJitter(this.delayBetweenBatches, 0.1);
        console.log("Pausing for " + batchPauseWithJitter + "ms before next batch");
        await new Promise(resolve => setTimeout(resolve, batchPauseWithJitter));
      }
    }
    return allResults;
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

    for (let i = 0; i < itemnames.length; i++) {
      try {
        const itemData = await this.getItemData(appid, itemnames[i], currency);
        results.push(itemData);

        if (i < itemnames.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
        }
      } catch (error) {
        console.error(`Error processing item ${itemnames[i]}: ${error.message}`);
      }
    }

    return results;
  }
}

module.exports = SteamApiClient;
