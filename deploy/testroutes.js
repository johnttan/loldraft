(function() {
  var models, mongoose, passport, sendgames, validator;

  mongoose = require('mongoose');

  passport = require('passport');

  models = require('./models/data').models;

  sendgames = require('./models/sendgames');

  validator = require('validator');

  mongoose.connect('mongodb://localhost/test');

  models.User.findOne({
    'username': req.body.username
  }, function(err, doc) {
    if (err) {
      return console.log(err);
    } else {
      return console.log(doc);
    }
  });

}).call(this);
