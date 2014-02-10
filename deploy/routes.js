(function() {
  var ensureLogin, models, passport, validator;

  passport = require('passport');

  models = require('./models/data').models;

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
        if (user.roster === void 0) {
          return res.send(404, 'no roster');
        } else {
          return user.populate('roster.top roster.mid roster.jungle roster.adc roster.support', function(err, user) {
            return res.json(user.roster);
          });
        }
      });
    });
    app.post('/draftplayers', ensureLogin('/'), function(req, res) {
      return models.User.findOne({
        'username': req.user.username
      }, function(err, user) {
        var play, role, rosterarray, _ref;
        if (err) {
          return console.log(err);
        }
        rosterarray = [];
        _ref = req.body;
        for (role in _ref) {
          play = _ref[role];
          rosterarray.push(play);
        }
        return models.Player.aggregate({
          $match: {
            playername: {
              $in: rosterarray
            }
          }
        }).exec(function(err, result) {
          var player, _i, _len;
          for (_i = 0, _len = result.length; _i < _len; _i++) {
            player = result[_i];
            console.log(player);
            if (user.roster === void 0) {
              user.roster = {};
            }
            user.roster[player['role']] = player['_id'];
            user.rosterarray = rosterarray;
          }
          return user.save(function(err, result) {
            return res.redirect('/roster');
          });
        });
      });
    });
    return app.get('/rankings', ensureLogin('/'), function(req, res) {
      return models.Player.aggregate({
        $match: {}
      }, {
        $sort: {
          'scores.totalscore': -1
        }
      }, {
        $project: {
          playername: 1,
          teamname: 1,
          'scores.totalscore': 1,
          gamesplayed: 1,
          role: 1
        }
      }).exec(function(err, result) {
        return models.User.findOne({
          'username': req.user.username
        }, function(err, user) {
          if (err) {
            return console.log(err);
          }
          console.log(user.rosterarray);
          console.log(typeof user.rosterarray[0]);
          console.log(typeof result[0].playername);
          return res.render('ranking', {
            items: result,
            rosterarray: user.rosterarray
          });
        });
      });
    });
  };

}).call(this);
