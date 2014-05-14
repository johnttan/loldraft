'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing'),
    Players = mongoose.model('Players');


/**
 * Get awesome things
 */

exports.players = function(req, res) {
  return Players.find({}, function (err, players) {
    if (!err) {
      res.setHeader('Cache-Control', 'public', 36000);
      return res.send(players);
    } else {
      return res.send(err);
    }
  });
};