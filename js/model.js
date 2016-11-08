/***********************************************************************************
 *
 * Model for Web2
 *
 ***********************************************************************************/
var  mongoose = require("mongoose");

(function(){ // wrap into a function to scope content
  var schema = mongoose.Schema;



  var user = new schema({
    userid: {type: String, required: true, unique: true},
    role: {type: String, required: true},
    given: {type: String, required: true},
    surname: {type: String, required: true},
    profile: {
      job_title: {type: String, required: true},
      email: {type: String, required: true},
      telephone: {type: String, required: true},
      roomnumber: {type: String, required: true},
      research: String
    },
    dissertations: String,
    password: {type: String, required: true, unique: true}
  });

  var dissertation = new schema({
    id: Number,
    title: String,
    description: String,
    proposer: String,
    proper_role: String,
    supervisor: String,
    interests: String
  });

  var User = mongoose.model('User', user);
  var Dissertation = mongoose.model('Dissertation', dissertation)

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
    User: User,
    Dissertation: Dissertation
    //
  }

  if(typeof __dirname == 'undefined') {
    window.hello = moduleExports; 
    // remember to add the following to the page:
    // https://www.npmjs.com/package/validator
  } else {
    module.exports = moduleExports;
    // use require() to import module dependencies
    //var validator = require('validator');
  }

})();
