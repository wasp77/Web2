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

  /***********************************************************************************
   * @constructor
   * Representation for dissertations
   ***********************************************************************************/
  function Dissertation(id,title, description, proposer, proposer_role) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.proposer = proposer;
    this.proposer_role = proposer_role;
  }

  Dissertation.prototype = {
    getId: function() {
      return this.id;
    },
    getTitle: function() {
      return this.title;
    },
    getDescription: function() {
      return this.description;
    },
    getProposer: function() {
      return this.proposer;
    },
    getProposerRole: function() {
      return this.proposer_role;
    }
  }

  /***********************************************************************************
   * @constructor
   * Representation for user
   ***********************************************************************************/
  function User(userId, role, given, surname, password) {
    this.userId = userId;
    this.role = role;
    this.given = given;
    this.surname = surname;
    this.password = password;
  }

  function Profile(job_title, email, telephone, roomnumber, research) {
    this.job_title = job_title;
    this.email = email;
    this.telephone = telephone;
    this.roomnumber = roomnumber;
    this.research = research;
  }

  Profile.prototype = User.prototype = {
    getId: function() {
      return this.userId;
    },
    getRole: function() {
      return this.role;
    },
    getGiven: function() {
      return this.given;
    },
    getSurname: function() {
      return this.surname;
    },
    getPassword: function() {
      return this.password;
    },
    getJobTitle: function() {
      return this.job_title;
    },
    getEmail: function() {
      return this.email;
    },
    getTelephone: function() {
      return this.telephone;
    },
    getRoomnumber: function() {
      return this.roomnumber;
    },
    getResearch: function() {
      this.research;
    }
  }





})();
