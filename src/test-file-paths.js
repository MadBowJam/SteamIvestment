const path = require('path');
const fs = require('fs').promises;

// Get the absolute path to the project root directory
const rootDir = path.resolve(__dirname, '..');

async function testFilePaths() {
  try {
    console.log('Testing file paths...');
    console.log('Root directory:', rootDir);
    
    // Test writing to ItemList.json
    const itemListPath = path.join(rootDir, 'src', 'components', 'ItemList.json');
    console.log('ItemList.json path:', itemListPath);
    
    // Read the existing file to verify we can access it
    const itemListData = await fs.readFile(itemListPath, 'utf8');
    console.log('Successfully read ItemList.json');
    
    // Test writing to a test file in the json directory
    const jsonTestPath = path.join(rootDir, 'src', 'json', 'test-file-paths.json');
    console.log('Test JSON path:', jsonTestPath);
    
    // Write a simple test object to the file
    await fs.writeFile(jsonTestPath, JSON.stringify({ test: 'success', timestamp: new Date().toISOString() }, null, 2));
    console.log('Successfully wrote to test JSON file');
    
    console.log('All file path tests passed!');
  } catch (error) {
    console.error('Error testing file paths:', error.message);
    console.error(error);
  }
}

testFilePaths();