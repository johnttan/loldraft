(function() {
  var EventEmitter, models, mongoose, passportLocalMongoose;

  models = require('./data').models;

  mongoose = require('mongoose');

  EventEmitter = require('events').EventEmitter;

  passportLocalMongoose = require('passport-local-mongoose');

}).call(this);
