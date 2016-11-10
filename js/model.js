/***********************************************************************************
 *
 * Model for Web2
 *
 ***********************************************************************************/
var  mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

(function(){ // wrap into a function to scope content
  var schema = mongoose.Schema;



  var user = new schema({
    userid: String,
    role: String,
    given: String,
    surname: String,
    job_title: String,
    email: String,
    telephone: String,
    roomnumber: String,
    research: String,
    dissertations: String,
    password: String
  });

  var dissertation = new schema({
    id: Number,
    title: String,
    description: String,
    proposer: String,
    proposer_role: String,
    supervisor: String,
    interests: String,
    assigned: Boolean
  });

  user.pre('save', function(callback) {
    var user = this;
    if (!user.isModified('password')) {
      return callback();
    }
    bcrypt.hash(user.password, null, null, function(err, hash) {
      if (err) {
        return callback(err);
      }
      user.password = hash;
      callback();
    });
  });


  user.methods.verifyPassword = function(password, callBack) {
    bcrypt.compare(password, this.password, function(err, res) {
      if (err){
        return callBack(err);
      }
      callBack(null, res);
    });
  };

  dissertation.methods.showInterest = function(interest) {
    if (this.interests == 'undefined') {
      this.interests = interest;
    } else {
      this.interests = this.interests + ' ' + interest;
    }
  };

  dissertation.methods.allocate = function() {
    this.assigned = true;
  }



  var User = mongoose.model('User', user);
  var Dissertation = mongoose.model('Dissertation', dissertation);

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
  };

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
