/***********************************************************************************
 * RESTful API implementation for Web2
 ***********************************************************************************/

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var models = require('./model.js');
//var validator = require('validator');

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
    console.log("Server Started")
  }

  /**
   * Configue the app processing pipeline. Call directly instead of runApp() for
   * testing with test doubles.
   */
  function configureApp(app) {
    mongoose.connect('mongodb://localhost/mydatabase', function(err, res) {
      if (err) {
        console.log("Error connecting" + err)
      } else {
        console.log("Connected to the database")
      }
    });
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('static'));

    app.route("/dissertation")
        .post(function(req, res) {
          var dissertation = new models.Dissertation();
          dissertation.id = req.body.id;
          dissertation.title = req.body.title;
          dissertation.description = req.body.description;
          dissertation.proposer = req.body.proposer;
          dissertation.proper_role = req.body.proper_role;


          dissertation.save(function(err) {
            if (err) {
              res.send(err)
            }
            res.json({ message: 'Dissertation created' });
          })

        })

        .get(function(req, res) {
          models.Dissertation.find(function(err, dissertations) {
            if (err) {
              res.send(err);
            }
            res.json(dissertations);
          })
        });

    app.route("/dissertation/:id")
        .get(function(req, res) {

        })
        .put(function(req, res) {

        })
        .delete(function(req, res) {
          models.Dissertation.remove({
            _id: req.params.id
          }, function(err, bear) {
            if (err)
              res.send(err);

            res.json({ message: 'Successfully deleted' });
          })
        });
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
