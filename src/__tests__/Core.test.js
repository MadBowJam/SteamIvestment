const axios = require('axios');
const { getprice, getprices } = require('../Core');

// Mock axios to prevent actual API calls during tests
jest.mock('axios');

describe('Core.js', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getprice', () => {
    it('should fetch price and image data successfully', async () => {
      // Mock successful responses
      axios.get.mockImplementation((url, config) => {
        if (url.includes('steamcommunity.com/market/priceoverview')) {
          return Promise.resolve({
            data: {
              success: true,
              lowest_price: '$2.50',
              volume: '1,234',
              median_price: '$2.55'
            }
          });
        } else if (url.includes('api.steamapis.com/image')) {
          return Promise.resolve({
            data: Buffer.from('mock-image-data')
          });
        }
      });

      // Call the function
      const result = await getprice(730, 'Test Item', 1);

      // Assertions
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('image');
      expect(result.price.lowest_price).toBe('$2.50');
      expect(result.price.volume).toBe('1,234');
      
      // Verify axios was called with correct parameters
      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(axios.get).toHaveBeenCalledWith(
        'https://steamcommunity.com/market/priceoverview',
        expect.objectContaining({
          params: {
            currency: 1,
            appid: 730,
            market_hash_name: 'Test Item'
          }
        })
      );
    });

    it('should handle API errors properly', async () => {
      // Mock failed response
      axios.get.mockRejectedValueOnce(new Error('API error'));

      // Call the function and expect it to reject
      await expect(getprice(730, 'Test Item', 1))
        .rejects
        .toThrow('Error occurred while fetching data for item \'Test Item\': Error: API error');
    });

    it('should handle unsuccessful responses', async () => {
      // Mock unsuccessful response
      axios.get.mockResolvedValueOnce({
        data: { success: false }
      });

      // Call the function and expect it to reject
      await expect(getprice(730, 'Test Item', 1))
        .rejects
        .toThrow('Request for item \'Test Item\' failed.');
    });
  });

  describe('getprices', () => {
    it('should fetch prices for multiple items', async () => {
      // Mock getprice to return test data
      const mockPrice1 = { price: { lowest_price: '$1.00' }, image: Buffer.from('image1') };
      const mockPrice2 = { price: { lowest_price: '$2.00' }, image: Buffer.from('image2') };
      
      // Create a spy on getprice that returns different values for different inputs
      jest.spyOn(global, 'getprice')
        .mockResolvedValueOnce(mockPrice1)
        .mockResolvedValueOnce(mockPrice2);

      // Call the function
      const results = await getprices(730, ['Item1', 'Item2'], 1);

      // Assertions
      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(mockPrice1);
      expect(results[1]).toEqual(mockPrice2);
    });

    it('should validate input parameters', async () => {
      // Test invalid appid
      await expect(getprices('invalid', ['Item1'], 1))
        .rejects
        .toThrow('Appid must be a valid number.');

      // Test invalid currency
      await expect(getprices(730, ['Item1'], 'invalid'))
        .rejects
        .toThrow('Currency must be a valid number.');

      // Test invalid itemnames
      await expect(getprices(730, null, 1))
        .rejects
        .toThrow('Itemnames must be a string or an array of strings.');
    });
  });
});