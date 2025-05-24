# Optimized Steam API Usage Guide

This guide explains the optimizations made to improve the efficiency of Steam API requests while avoiding rate limiting.

## Background

The Steam API has rate limiting that can block requests if too many are made in a short period:
- Parallel requests get blocked after 30-50 requests
- Sequential requests every 3-3.4 seconds get blocked after 100-150 requests
- Sequential requests every 3.5+ seconds generally don't get blocked

The original implementation used a fixed 3.5-second delay between requests, which was reliable but slow.

## Optimizations Implemented

The new implementation in `SteamApiClient.js` includes several optimizations:

1. **Batch Processing**: Items are processed in smaller batches (default 10 items per batch)
2. **Adaptive Delays**: The delay between requests automatically adjusts based on success/failure
3. **Jitter**: Random variation is added to delays to avoid synchronized requests
4. **Intelligent Retry**: Rate-limited requests are retried with increasing delays
5. **Batch Pauses**: Longer pauses between batches to allow the API to recover

## How to Use the Optimized Client

### Basic Usage

```javascript
const SteamApiClient = require('./api/SteamApiClient');

// Create client with default settings
const steamClient = new SteamApiClient();

// Fetch data for multiple items with optimized strategy
const results = await steamClient.getItemsDataOptimized(730, itemNames, 1);
```

### Advanced Configuration

```javascript
const steamClient = new SteamApiClient({
  // Retry settings
  maxRetries: 3,        // Maximum retry attempts for rate-limited requests
  retryDelay: 2000,     // Base delay between retries (ms)
  timeout: 10000,       // Request timeout (ms)
  
  // Adaptive delay settings
  initialDelay: 3500,   // Starting delay between requests (ms)
  minDelay: 2800,       // Minimum delay between requests (ms)
  maxDelay: 5000,       // Maximum delay between requests (ms)
  
  // Batch settings
  batchSize: 10,        // Number of items to process in each batch
  delayBetweenBatches: 5000  // Pause between batches (ms)
});
```

### Optimizing for Your Use Case

You can adjust the settings based on your specific needs:

- **For maximum speed** (with higher risk of rate limiting):
  ```javascript
  const steamClient = new SteamApiClient({
    initialDelay: 3000,
    minDelay: 2500,
    batchSize: 15
  });
  ```

- **For maximum reliability** (with slower processing):
  ```javascript
  const steamClient = new SteamApiClient({
    initialDelay: 4000,
    minDelay: 3500,
    maxDelay: 6000,
    batchSize: 5,
    delayBetweenBatches: 8000
  });
  ```

## Performance Comparison

The optimized implementation can be significantly faster while still avoiding rate limiting:

- **Original approach**: ~3.5 seconds per item
- **Optimized approach**: ~1-2 seconds per item (average) depending on configuration

For a collection of 100 items:
- Original: ~350 seconds (5.8 minutes)
- Optimized: ~150 seconds (2.5 minutes)

## Example Implementation

See `src/examples/OptimizedSteamPriceCheck.js` for a complete example of how to use the optimized client.

## Monitoring and Debugging

The optimized client includes detailed logging:

- Batch progress information
- Adaptive delay adjustments
- Rate limit detection and handling
- Success and error counts

You can monitor these logs to fine-tune the configuration for your specific use case.

## Troubleshooting

If you still encounter rate limiting:

1. Increase `initialDelay` and `minDelay`
2. Decrease `batchSize`
3. Increase `delayBetweenBatches`

If processing is too slow:

1. Decrease `initialDelay` (but not below 2800ms)
2. Increase `batchSize` (but not above 15-20)
3. Decrease `delayBetweenBatches` (but not below 3000ms)