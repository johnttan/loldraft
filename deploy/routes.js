(function() {
  var models, passport, sendgames, validator;

  passport = require('passport');

  models = require('./models/data').models;

  sendgames = require('./models/sendgames');

  validator = require('validator');

  module.exports = function(app) {
    app.get('/', function(req, res) {
      if (req.user) {
        res.render('draft');
      }
      return res.render('index.jade');
    });
    app.post('/register', function(req, res) {
      var error;
      try {
        console.log(req.body.username);
        return models.User.register(new models.User({
          username: req.body.name,
          email: req.body.email
        }), req.body.password, function(err, account) {
          if (err) {
            if (err.message === 'User already exists with name ' + req.body.username) {
              console.log('user exists. logging in');
              return passport.authenticate('local')(req, res, function() {
                return res.render('draft.jade', {
                  name: req.user.username
                });
              });
            } else {
              console.log(err);
              return res.send(404, err);
            }
          } else {
            return passport.authenticate('local')(req, res, function() {
              return res.render('draft.jade', {
                name: req.user.username
              });
            });
          }
        });
      } catch (_error) {
        error = _error;
        return res.send(404, error);
      }
    });
    app.post('/login', passport.authenticate('local'), function(req, res) {
      return res.render('draft.jade', {
        name: req.user.username
      });
    });
    app.post('/checkusername', function(req, res) {
      return models.User.findOne({
        'username': req.body.username
      }, function(err, doc) {
        if (err) {
          console.log(err);
          return res.send(err);
        } else if (doc) {
          return res.send('null');
        } else {
          console.log('sending true');
          return res.send(true);
        }
      });
    });
    return app.post('/checkemail', function(req, res) {
      if (validator.isEmail(req.body.email) !== true) {
        res.send('Email is not of valid form!');
      }
      return models.User.findOne({
        'email': req.body.email
      }, function(err, doc) {
        if (err) {
          console.log(err);
          return res.send(err);
        } else if (doc) {
          return res.send('null');
        } else {
          return res.send(true);
        }
      });
    });
  };

}).call(this);
