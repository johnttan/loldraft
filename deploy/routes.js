(function() {
  var ensureLogin, models, passport, sendgames, validator;

  passport = require('passport');

  models = require('./models/data').models;

  sendgames = require('./models/sendgames');

  validator = require('validator');

  ensureLogin = require('connect-ensure-login').ensureLoggedIn;

  module.exports = function(app) {
    app.get('/', function(req, res) {
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
              return res.send(404, err);
            } else {
              console.log(err);
              return res.send(404, err);
            }
          } else {
            console.log('registered, logging in ' + account);
            return req.login(account, function(err) {
              return res.render('draft.jade', {
                name: account.username
              });
            });
          }
        });
      } catch (_error) {
        error = _error;
        return res.send(404, error);
      }
    });
    app.post('/login', passport.authenticate('local', {
      session: true
    }), function(req, res) {
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
          return res.send(true);
        }
      });
    });
    app.post('/checkemail', function(req, res) {
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
    return app.get('/roster', ensureLogin('/'), function(req, res) {
      return models.User.findOne({
        'username': req.user.username
      }, function(err, doc) {
        console.log('error at roster route');
        return res.json(doc.roster);
      });
    });
  };

}).call(this);
