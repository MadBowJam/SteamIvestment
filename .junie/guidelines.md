# SteamInvestment Project Guidelines

## Build and Configuration Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application
The application consists of two parts: a React frontend and a Node.js backend.

1. Start the React development server:
   ```bash
   npm start
   # or
   yarn start
   ```
   This will start the React application on http://localhost:3000

2. Start the Node.js backend server:
   ```bash
   node server.js
   ```
   This will start the backend server on http://localhost:5000

### Building for Production
To create a production build:
```bash
npm run build
# or
yarn build
```

### Environment Configuration
The application uses the following environment variables:
- `PORT`: The port for the backend server (default: 5000)
- `TINIFY_API_KEY`: API key for TinyPNG image optimization

### API Keys
- The application uses the TinyPNG API for image optimization. The API key should be set in the `.env` file.
- A `.env.example` file is provided as a template. Copy it to `.env` and add your actual API key.
- The `.env` file is excluded from version control in `.gitignore` to keep sensitive information secure.

## Testing Information

### Testing Setup
The project uses Jest and React Testing Library for testing React components. The testing configuration is set up in:
- `src/setupTests.js`: Imports Jest DOM extensions
- `package.json`: Contains the test script configuration

### Running Tests
To run all tests:
```bash
npm test
# or
yarn test
```

To run tests in watch mode (recommended during development):
```bash
npm test -- --watch
# or
yarn test --watch
```

### Writing Tests
#### Component Tests
For testing React components, use React Testing Library. Here's an example of testing a component that displays Steam item data:

```jsx
// TableBody.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CustomTableBody from './TableBody';
import tableReducer from '../slices/OpenRowSlice';
import deleteItemReducer from '../slices/DeleteRowSlice';
import editItemReducer from '../slices/EditItemSlice';

// Mock data for testing
const mockItems = [
  {
    tournament: 'Stockholm 2021',
    name: 'Sticker Capsule',
    price: 2.50,
    quantity: 10,
    total: 25.00,
    spendOnBuy: 1.00
  }
];

// Create a mock store
const store = configureStore({
  reducer: {
    table: tableReducer,
    deleteItem: deleteItemReducer,
    editItem: editItemReducer
  }
});

test('renders table body with item data', () => {
  render(
    <Provider store={store}>
      <table>
        <CustomTableBody filteredData={mockItems} />
      </table>
    </Provider>
  );

  // Check if item data is displayed
  expect(screen.getByText('Stockholm 2021')).toBeInTheDocument();
  expect(screen.getByText('Sticker Capsule')).toBeInTheDocument();
});

test('opens row details when clicked', () => {
  render(
    <Provider store={store}>
      <table>
        <CustomTableBody filteredData={mockItems} />
      </table>
    </Provider>
  );

  // Click on the row
  fireEvent.click(screen.getByText('Stockholm 2021').closest('tr'));

  // Check if details are displayed (this would depend on your implementation)
  // For example, if a profit calculation is shown:
  expect(screen.getByText(/Your profit:/i)).toBeInTheDocument();
});
```

#### API Tests
For testing API functions, create mock responses and test the functions in isolation:

```javascript
// Core.test.js
import axios from 'axios';
import { getprice } from './Core';

// Mock axios
jest.mock('axios');

test('getprice fetches and returns price data', async () => {
  // Setup mock responses
  axios.get.mockImplementation((url) => {
    if (url.includes('steamcommunity.com')) {
      return Promise.resolve({
        data: {
          success: true,
          lowest_price: '$2.50',
          volume: '1,234',
          median_price: '$2.55'
        }
      });
    } else if (url.includes('api.steamapis.com')) {
      return Promise.resolve({
        data: Buffer.from('mock-image-data')
      });
    }
  });

  // Call the function
  const result = await getprice(730, 'Test Item', 1);

  // Assertions
  expect(result.price.lowest_price).toBe('$2.50');
  expect(result.price.volume).toBe('1,234');
  expect(result.image).toBeDefined();

  // Verify axios was called with correct parameters
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
```

### Test Coverage
To generate a test coverage report:
```bash
npm test -- --coverage
# or
yarn test --coverage
```

## Additional Development Information

### Project Structure
- `src/`: Contains the React application code
  - `components/`: React components
    - `dom/`: UI components
    - `functions/`: Utility functions
    - `slices/`: Redux slices for state management
  - `json/`: JSON data files
  - `images/`: Image assets
  - `Core.js`: Core functionality for Steam API interaction
  - `SteamPriceCheck.js`: Script for checking Steam prices
  - `util-patch.js`: Utility to patch deprecated Node.js APIs
- `server.js`: Express server for backend functionality

### State Management
The application uses Redux Toolkit for state management. Redux slices are located in `src/components/slices/`.

### API Integration
- Steam Market API: Used for fetching item prices
- Steam APIs: Used for fetching item images
- NBU API: Used for fetching currency exchange rates

### Code Style
- Use functional components with hooks for React components
- Use Redux Toolkit for state management
- Follow the existing pattern of organizing components by functionality
- Use async/await for asynchronous operations

### Common Issues and Solutions
1. **Steam API Rate Limiting**: The Steam API has rate limits. If you encounter 429 errors, implement retry logic with exponential backoff.

2. **Image Optimization**: The application uses TinyPNG for image optimization. Ensure you have a valid API key.

3. **Currency Conversion**: The application fetches currency rates from the National Bank of Ukraine. If this service is unavailable, implement a fallback mechanism.

4. **Node.js Deprecation Warnings**: The application includes a utility (`src/util-patch.js`) to patch deprecated Node.js APIs:
   - `util._extend`: This API is deprecated (DEP0060) and has been replaced with `Object.assign()`.
   - The patch is applied in both `SteamPriceCheck.js` and `Core.js` to prevent deprecation warnings.

5. **TypeScript Integration**: The project uses TypeScript for some files:
   - The webpack configuration has been updated to handle TypeScript files using ts-loader.
   - If you encounter errors during `yarn install` or `npm install`, ensure that ts-loader is properly installed as a devDependency.
   - The webpack configuration includes the necessary extensions and rules for processing TypeScript files.

6. **Permission Issues During Installation**: If you encounter permission errors (EACCES) when running `yarn install` or `npm install`:
   - Check the ownership of the node_modules directory: `ls -la | grep node_modules`
   - If the directory is owned by root or another user, you may need to:
     ```bash
     # Remove the existing node_modules directory
     sudo rm -rf node_modules

     # Reinstall packages
     yarn install
     # or
     npm install
     ```
   - Avoid using `sudo` with npm or yarn commands as it can lead to permission issues.

### Performance Considerations
- The application makes multiple API calls to fetch prices and images. Consider implementing caching to reduce API calls.
- Large image files can impact performance. Ensure images are properly optimized.
- Consider implementing pagination for large item lists.

### Automated Price Updates
The project includes a GitHub Actions workflow that automatically runs `SteamPriceCheck.js` daily and pushes any changes to the repository. This ensures that price data is always up-to-date without manual intervention.

#### Workflow Configuration
- The workflow is defined in `.github/workflows/daily-price-update.yml`
- It runs at midnight UTC every day
- It can also be triggered manually via the GitHub Actions UI

#### How It Works
1. The workflow checks out the repository
2. Sets up Node.js and installs dependencies
3. Runs `SteamPriceCheck.js` to update prices
4. If there are any changes (updated prices), it commits and pushes them to the repository

#### Required Secrets
For the workflow to function properly, you need to add the following secret to your GitHub repository:
- `TINIFY_API_KEY`: Your TinyPNG API key for image optimization

To add this secret:
1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Enter "TINIFY_API_KEY" as the name and your API key as the value
5. Click "Add secret"

#### Monitoring and Troubleshooting
- You can monitor workflow runs in the "Actions" tab of your GitHub repository
- If the workflow fails, check the logs for error messages
- Common issues include:
  - Missing GitHub secret (TINIFY_API_KEY)
  - Network issues when connecting to Steam API
  - Rate limiting from the Steam API
