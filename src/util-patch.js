// This file patches the deprecated util._extend API with Object.assign
// to prevent the DEP0060 deprecation warning

// Only apply the patch if we're in a Node.js environment
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  const util = require('util');
  
  // Check if _extend exists and hasn't been patched yet
  if (util._extend && util._extend.toString().indexOf('Object.assign') === -1) {
    // Replace util._extend with Object.assign
    util._extend = Object.assign;
    
    console.log('util._extend has been patched to use Object.assign');
  }
}

module.exports = {}; // Export an empty object so this can be required