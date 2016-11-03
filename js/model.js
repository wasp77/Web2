/***********************************************************************************
 *
 * Model for Web2
 *
 ***********************************************************************************/

(function(){ // wrap into a function to scope content


  /***********************************************************************************
   * Excpetion classes
   ***********************************************************************************/

  /**
   * Error thrown when validation of inputs fails.
   */
  function ValidationError(msg, filename, linenumber) {
    Error.call(this, msg, filename, linenumber);
  }
  ValidationError.prototype = Error.prototype;

  /***********************************************************************************
   * Module imports and exports - to work in browser and node.js
   ***********************************************************************************/
  var moduleExports = {
    //
  }

  if(typeof __dirname == 'undefined') {
    window.hello = moduleExports; 
    // remember to add the following to the page:
    // https://www.npmjs.com/package/validator
  } else {
    module.exports = moduleExports;
    // use require() to import module dependencies
    var validator = require('validator'); 
  }
})();
