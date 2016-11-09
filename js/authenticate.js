var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var models = require('./model.js');

passport.use(new BasicStrategy(function(username, password, callback) {
    models.User.findOne({userid: username}, function(err, user) {
        if (err) {
            return callback(err);
        }

        if (!user && user != 'admin') {
            return callback(null, false);
        }

        user.verifyPassword(function(err, verified) {
            if (err) {
                return callback(err);
            }

            if (!verified) {
                return callback(null, false);
            }

            return callback(null, user);
        });
    });
}));

exports.authenticateUser = passport.authenticate('basic', {session: false});