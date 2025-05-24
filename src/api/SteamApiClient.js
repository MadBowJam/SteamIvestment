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

      // Include the itemname in the result for easier mapping
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
      const delayWithJitter = this._getDelayWithJitter(newDelay);

      try {
        // Wait before making the request (except for the first item in the batch)
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, delayWithJitter));
        }

        // Fetch data for this item
        const itemData = await this.getItemData(appid, itemname, currency);
        batchResults.push(itemData);

        // Track consecutive successes for potential delay reduction
        consecutiveSuccesses++;

        // If we've had several consecutive successes, slightly reduce the delay
        if (consecutiveSuccesses >= 5) {
          // Reduce delay by 50ms, but not below minDelay
          newDelay = Math.max(this.minDelay, newDelay - 50);
          consecutiveSuccesses = 0; // Reset counter
          console.log(`Reducing delay to ${newDelay}ms after consecutive successes`);
        }
      } catch (error) {
        // Check if this was a rate limit error
        if (error.message.includes('429') || error.message.toLowerCase().includes('rate limit')) {
          rateLimitHits++;

          // Increase delay based on how many rate limit hits we've had
          const increase = 200 * rateLimitHits;
          newDelay = Math.min(this.maxDelay, newDelay + increase);

          console.warn(`Rate limit hit. Increasing delay to ${newDelay}ms`);

          // Add an extra pause after hitting a rate limit
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Try this item again (decrement i to retry)
          i--;
          consecutiveSuccesses = 0;
        } else {
          // For other errors, log and continue
          console.error(`Error processing item ${itemname}: ${error.message}`);
          // Add a placeholder for the failed item
          batchResults.push({ itemname, error: error.message });
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

    // Use provided initialDelay or the class property
    const startingDelay = initialDelay || this.initialDelay;

    // Split items into batches
    const batches = [];
    for (let i = 0; i < itemnames.length; i += this.batchSize) {
      batches.push(itemnames.slice(i, i + this.batchSize));
    }

    console.log(`Processing ${itemnames.length} items in ${batches.length} batches of up to ${this.batchSize} items each`);

    const allResults = [];
    let currentDelay = startingDelay;

    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      console.log(`Processing batch ${i + 1}/${batches.length} with delay ${currentDelay}ms`);

      const { results, newDelay } = await this._processBatchWithAdaptiveDelay(
        appid, 
        batches[i], 
        currency, 
        currentDelay
      );

      // Add results from this batch to the overall results
      allResults.push(...results);

      // Update the delay for the next batch
      currentDelay = newDelay;

      // Add a longer pause between batches (except after the last batch)
      if (i < batches.length - 1) {
        const batchPauseWithJitter = this._getDelayWithJitter(this.delayBetweenBatches, 0.1);
        console.log(`Pausing for ${batchPauseWithJitter}ms before next batch`);
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
