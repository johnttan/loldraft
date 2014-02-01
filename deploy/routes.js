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
    app.get('/logout', function(req, res) {
      req.logout();
      return res.redirect('/');
    });
    app.post('/login', passport.authenticate('local', {
      session: true
    }), function(req, res) {
      return res.render('draft.jade', {
        name: req.user.username
      });
    });
    app.get('/autologin', function(req, res) {
      return req.login(req.user, function(err) {
        if (err) {
          return res.send(404, 'not logged in');
        } else {
          return res.render('draft.jade', {
            name: req.user.username
          });
        }
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
    app.get('/roster', ensureLogin('/'), function(req, res) {
      return models.User.findOne({
        'username': req.user.username
      }, function(err, user) {
        if (err) {
          return console.log(err);
        }
        return user.populate('roster', function(err, user) {
          return res.json(user.roster);
        });
      });
    });
    return app.post('/draftplayers', ensureLogin('/'), function(req, res) {
      return models.User.findOne({
        'username': req.user.username
      }, function(err, user) {
        var play, role, _ref, _results;
        if (err) {
          return console.log(err);
        }
        user.roster = [];
        user.rosterarray = [];
        _ref = req.body;
        _results = [];
        for (role in _ref) {
          play = _ref[role];
          _results.push(models.Player.findOne({
            'playername': play
          }, function(err, player) {
            if (err) {
              return console.log(err);
            }
            if (user.roster.length < 5) {
              user.roster.push(player);
              player.owner = user;
            }
            if (user.rosterarray.length < 5) {
              user.rosterarray.push(player.playername);
            }
            return user.save(function(err, user) {
              return player.save(function(err, player) {
                if (user.rosterarray.length === 5) {
                  return user.populate('roster', function(err, user) {
                    console.log(user.roster);
                    return res.json(user.roster);
                  });
                }
              });
            });
          }));
        }
        return _results;
      });
    });
  };

}).call(this);
