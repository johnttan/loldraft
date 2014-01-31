(function() {
  var htmlparse, latestgamereset, models, mongoose;

  htmlparse = require('./htmlparse3');

  mongoose = require('mongoose');

  models = require('./data').models;

  mongoose.connect('mongodb://localhost/test');

  latestgamereset = function() {
    return htmlparse.queryandretrieve.reset(1669, 1800);
  };

  latestgamereset();

  htmlparse.queryandretrieve.NA();

  htmlparse.queryandretrieve.EU();

  exports.resettogame = htmlparse.queryandretrieve.reset;

  exports.resetlatestgame = latestgamereset;

  exports.queryandretrieveNA = htmlparse.queryandretrieve.NA;

  exports.queryandretrieveEU = htmlparse.queryandretrieve.EU;

}).call(this);