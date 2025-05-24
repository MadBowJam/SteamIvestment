# Fix for File Path Issues in SteamPriceCheck.js

## Issue Description

The script was encountering an error when trying to write to the file `./src/components/ItemList.json`:

```
Fatal error in fetchData: ENOENT: no such file or directory, open './src/components/ItemList.json'
```

This error occurred because the script was using relative file paths that depend on the current working directory from which the script is run. If the script was run from a directory other than the project root, it would not be able to find the files at the specified relative paths.

## Solution

The solution was to use absolute file paths instead of relative paths. This ensures that the script can find and write to the correct files regardless of the working directory from which it's run.

### Changes Made

1. Added the `path` module to handle file paths properly:
   ```javascript
   const path = require('path');
   ```

2. Added a constant to resolve the absolute path to the project root directory:
   ```javascript
   const rootDir = path.resolve(__dirname, '..');
   ```

3. Updated the file paths in the `optimizeAndSaveImage` function to use absolute paths:
   ```javascript
   await fs.writeFile(path.join(rootDir, 'images', imageName), optimizedImage);
   ```

4. Updated the file paths in the `fetchData` function to use absolute paths:
   ```javascript
   await fs.writeFile(path.join(rootDir, 'src', 'components', 'ItemList.json'), JSON.stringify(itemsArray, null, 2));
   await fs.writeFile(path.join(rootDir, 'src', 'json', `${today}.json`), JSON.stringify(itemsArray, null, 2));
   ```

## Testing

A test script (`src/test-file-paths.js`) was created to verify that the file paths work correctly. The test script:

1. Resolves the absolute path to the project root directory
2. Reads the ItemList.json file to verify it can be accessed
3. Writes a test file to the json directory

The test script ran successfully, confirming that the fix works correctly.

## Best Practices

When working with file paths in Node.js applications, it's generally best to:

1. Use the `path` module to handle file paths in a cross-platform way
2. Use absolute paths instead of relative paths when possible
3. Use `path.join()` or `path.resolve()` to construct file paths instead of string concatenation
4. Use `__dirname` or `process.cwd()` as a base for constructing absolute paths

By following these best practices, you can avoid issues with file paths that depend on the current working directory.