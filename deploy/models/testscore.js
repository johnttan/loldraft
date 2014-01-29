(function() {
  var models, mongoose, scoreupdate;

  models = require('./data').models;

  scoreupdate = require('./scoreupdate');

  mongoose = require('mongoose');

  mongoose.connect('mongodb://localhost/test');

  models.Game.findOne({
    gameid: 'na1876'
  }, function(err, doc) {
    return doc.updatescore();
  });

}).call(this);
