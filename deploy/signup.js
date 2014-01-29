(function() {
  var query;

  query = require('./models/queries');

  module.exports = function() {
    return function(req, res, next) {
      return query.signup(req, res, next);
    };
  };

}).call(this);
