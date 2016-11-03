/***********************************************************************************
 * RESTful API implementation for Web2
 ***********************************************************************************/

var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');

(function() {

  module.exports = {
    runApp: runApp,
    configureApp: configureApp, // separates out from runApp for testing
    // export your handler methods for testing
    ApiError: ApiError
  };

  /***********************************************************************************
   * Express Application
   ***********************************************************************************/

  /**
   * Run the app on the default port 8080. Makes use of configurApp to set up the
   * processing pipeline.
   */
  function runApp() {
    var app = express();
    configureApp(app);
    app.listen(8080);
  }

  /**
   * Configue the app processing pipeline. Call directly instead of runApp() for
   * testing with test doubles.
   */
  function configureApp(app) {

    app.use(bodyParser.json());

    app.use(express.static('static'));
  }

  /***********************************************************************************
   * Application Model
   *
   * In-memory representation of the data model. 
   ***********************************************************************************/

  var model = {
    // 
  }

  /***********************************************************************************
   * Handler Functions
   ***********************************************************************************/


  /***********************************************************************************
   * Excpetion classes
   ***********************************************************************************/

  /**
   * @constructor
   * Error thrown by the API.
   */
  function ApiError(msg, filename, linenumber) {
    Error.call(this, msg, filename, linenumber);
  }
  ApiError.prototype = Error.prototype;

})();
