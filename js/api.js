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
          res.json({message: 'could not add admin'});
      } else {
        console.log("Connected to the database");
        models.User.findOne({userid: 'admin'}, function(err, user) {
            if (!user) {
                var admin = new models.User;
                admin.userid = 'admin';
                admin.password = 'admin';
                admin.save(function(err) {
                    if (err){
                        res.json({message: 'could not add admin'});
                    }
                });
            }
        });
      }
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('static'));
    app.use(morgan('dev'));

    app.route("/dissertation")
        .post(authenticateController.authenticateUser, function(req, res) {
          var dissertation = new models.Dissertation();
          dissertation.id = req.body.id;
          dissertation.title = req.body.title;
          dissertation.description = req.body.description;
          dissertation.proposer = req.body.proposer;
          dissertation.proposer_role = req.body.proposer_role;
          dissertation.supervisor = req.body.supervisor;
          dissertation.interests = req.body.interests;

          dissertation.save(function(err) {
            if (err) {
              res.send(err);
              return;
            }
            res.json(dissertation);
          });
        })

        .get(authenticateController.authenticateUser, function(req, res) {
          models.Dissertation.find(function (err, dissertations) {
            if (err) {
              res.send(err);
              return;
            }
            res.json(dissertations);
          });
        });

    app.route("/dissertation/:id")
        .get(authenticateController.authenticateUser, function(req, res) {
          models.Dissertation.findById(req.params.id, function (err, dissertations) {
            if (err) {
              res.send(err);
              return;
            }
            res.json(dissertations);
          });
        })
        .put(authenticateController.authenticateUser, function(req, res) {
          models.Dissertation.update({_id: req.params.id}, req.body, function(err, data) {
            if (err) {
              res.send(err);
              return;
            }
            models.Dissertation.findById(req.params.id, function (err, dissertations) {
              if (err) {
                res.send(err);
                return;
              }
              res.json(dissertations);
            });
          });
        })
        .delete(authenticateController.authenticateUser, function(req, res) {
          models.Dissertation.remove({_id: req.params.id}, function (err, dissertations) {
            if (err){
                res.send(err);
                return;
            }
            res.json(dissertations);
          });
        });

    app.route('/dissertation/:id/interest/:userid')
        .post(authenticateController.authenticateUser, function(req, res) {
          var interest;
          models.User.find(req.params.userid, function(err, user) {
              if (err) {
                  res.send(err);
                  return;
              }
              interest = user.userid;
          });
          models.Dissertation.findById(req.params.id, function (err, dissertations) {
            if (err) {
              res.send(err);
              return;
            }
            dissertations.showInterest(interest);
            dissertations.save(function(err) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.json(dissertations);
            })
          });
        });

    app.route('/dissertation/:id/allocations/:userid')
        .post(authenticateController.authenticateUser, function(req,res) {
          models.Dissertation.findById(req.params.id, function (err, dissertations) {
            if (err) {
              res.send(err);
              return;
            }
            dissertations.allocate();
            dissertations.save(function(err) {
                if (err) {
                    res.send(err);
                    return;
                }
                res.json(dissertations);
            })
          });
        });

    app.route('/user')
        .get(authenticateController.authenticateUser, function(req, res) {
          models.User.find(function (err, users) {
            if (err) {
              res.send(err);
              return;
            }
            res.json(users);
          })
        });

    app.route('/user/:id')
        .get(authenticateController.authenticateUser, function(req, res) {
          models.User.findById(req.params.id, function (err, users) {
            if (err) {
              res.send(err);
              return;
            }
            res.json(users);
          })
        })
        .put(authenticateController.authenticateUser, function(req, res) {
          models.User.findById(req.params.id, function(err, users) {
           if (!users) {
             var user = new models.User();
             user.userid = req.body.userid;
             user.role = req.body.role;
             user.given = req.body.given;
             user.surname = req.body.surname;
             user.dissertations = req.body.dissertations;
             user.password = req.body.password;

             user.save(function(err) {
               if (err) {
                 res.send(err);
                 return;
               }
               res.json(user);
             });
           } else {
             models.User.update({_id: req.params.id}, req.body, function(err) {
               if (err) {
                 res.send(err);
                 return;
               }
               models.User.findById(req.params.id, function (err, users) {
                 if (err) {
                   res.send(err);
                   return;
                 }
                 res.json(users);
               });
             });
           }
          })
        })
        .delete(authenticateController.authenticateUser, function(req, res) {
          models.User.remove({
            _id: req.params.id
          }, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }

            res.json({message: 'Successfully deleted'});
          })
        });

    app.route('/user/staff')
        .get(authenticateController.authenticateUser, function(req, res) {
          models.User.find({role: 'staff'}, function (err, users) {
            if (err) {
                res.send(err);
                return;
            }

            res.json(users);
          })
        });


  }


    /**
     * @constructor
     * Error thrown by the API.
     */
    function ApiError(msg, filename, linenumber) {
        Error.call(this, msg, filename, linenumber);
    }
    ApiError.prototype = Error.prototype;

})();
