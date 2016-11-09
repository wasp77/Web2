/***********************************************************************************
 * RESTful API implementation for Web2
 ***********************************************************************************/

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var models = require('./model.js');
var authenticateController = require('./authenticate.js');
var passport = require('passport');
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
    app.use(morgan('dev'));


    app.route("/dissertation")
        .post(function(req, res) {
          var dissertation = new models.Dissertation();
          dissertation.id = req.body.id;
          dissertation.title = req.body.title;
          dissertation.description = req.body.description;
          dissertation.proposer = req.body.proposer;
          dissertation.proposer_role = req.body.proposer_role;

          dissertation.save(function(err) {
            if (err) {
              res.send(err)
            }
            res.json({ message: 'Dissertation created' });
          });
        })

        .get(function(req, res) {
          models.Dissertation.find(function (err, dissertations) {
            if (err) {
              res.send(err);
            }
            res.json(dissertations);
          });
        });

    app.route("/dissertation/:id")
        .get(function(req, res) {
          models.Dissertation.findById(req.params.id, function (err, dissertations) {
            if (err) {
              res.send(err);
            }
            res.json(dissertations);
          });
        })
        .put(function(req, res) {
          models.Dissertation.findById(req.params.id, function (err, dissertations) {
            if (err) {
              res.send(err);
            }
            //add updating of fields!
            dissertations.save(function (err) {
              if (err) {
                res.send(err);
              }
              res.json({message: 'Dissertation updated'});
            });
          });
        })
        .delete(function(req, res) {
          models.Dissertation.remove({_id: req.params.id}, function (err, dissertations) {
            if (err)
              res.send(err);

            res.json({message: 'Successfully deleted'});
          });
        });

    app.route('/dissertations/:id/interest/:userid')
        .post(function(req, res) {
          models.Dissertation.findById(req.params.id, function (err, dissertations) {
            if (err) {
              res.send(err);
            }
            res.json(dissertations);
          });
        });

    app.route('/dissertations/:id/allocations/:userid')
        .post(function(req,res) {
          models.Dissertation.findById(req.params.id, function (err, dissertations) {
            if (err) {
              res.send(err);
            }
            res.json(dissertations);
          });
        });

    app.route('/user')
        .get(function(req, res) {
          models.User.find(function (err, users) {
            if (err) {
              res.send(err);
            }
            res.json(users);
          })
        });

    app.route('/user/:id')
        .get(function(req, res) {
          models.User.findById(req.params.id, function (err, users) {
            if (err) {
              res.send(err);
            }
            res.json(users);
          })
        })
        .put(function(req, res) {
          models.User.findById(req.params.id, function (err, users) {
            if (err) {
              res.send(err);
            }

            //add the update abilities
            users.save(function (err) {
              if (err) {
                res.send(err);
              }
              res.json({message: 'User created or updated'});
            })
          })
        })
        .delete(function(req, res) {
          models.User.remove({
            _id: req.params.id
          }, function (err, users) {
            if (err)
              res.send(err);

            res.json({message: 'Successfully deleted'});
          })
        });

    app.route('/user/staff')
        .get(function(req, res) {
          models.User.find({proposer_role: 'staff'}, function (err, users) {
            if (err)
              res.send(err);

            res.json(users);
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
