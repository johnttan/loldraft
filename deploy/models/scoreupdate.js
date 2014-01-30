(function() {
  var async, math, mongoose, scoring, updatecsscore, updategoldscore, updatekdascore, updatepartscore, updatescoregame, updatescoreplayer;

  math = require('mathjs')();

  async = require('async');

  scoring = require('./scoring');

  mongoose = require('mongoose');

  updatekdascore = function(playerstat, game) {
    var score;
    score = scoring.kdascore(playerstat.kills, playerstat.deaths, playerstat.assists, playerstat.role);
    return score;
  };

  updatepartscore = function(playerstat, game) {
    var player, score, teamkills, _i, _len, _ref;
    teamkills = 0;
    _ref = game.players;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      player = _ref[_i];
      if (player.team === playerstat.team) {
        teamkills += player.kills;
      }
    }
    score = scoring.partscore(playerstat.kills, playerstat.assists, teamkills);
    return score;
  };

  updategoldscore = function(playerstat, game) {
    var oppgold, player, score, _i, _len, _ref;
    _ref = game.players;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      player = _ref[_i];
      if (player.team !== playerstat.team & player.role === playerstat.role) {
        oppgold = player.total_gold;
      }
    }
    score = scoring.goldscore(playerstat.total_gold, oppgold);
    return score;
  };

  updatecsscore = function(playerstat, game) {
    var error, oppcs, player, score, _i, _len, _ref;
    try {
      _ref = game.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        if (player.team !== playerstat.team & player.role === playerstat.role) {
          oppcs = player.minion_kills;
        }
      }
      score = scoring.csscore(playerstat.minion_kills, oppcs, playerstat.role);
    } catch (_error) {
      error = _error;
      console.log(error);
    }
    return score;
  };

  updatescoreplayer = function(playerstat, game) {
    var scorejson;
    scorejson = {
      winscore: 0,
      nodeathscore: 0
    };
    scorejson.kdascore = updatekdascore(playerstat, game);
    scorejson.partscore = updatepartscore(playerstat, game);
    scorejson.goldscore = updategoldscore(playerstat, game);
    scorejson.csscore = updatecsscore(playerstat, game);
    if (playerstat.win === 1) {
      scorejson.winscore = 0.2;
    }
    if (playerstat.deaths === 0) {
      scorejson.nodeathscore = 0.2;
    }
    scorejson.totalscore = scorejson.kdascore + scorejson.partscore + scorejson.csscore + scorejson.winscore + scorejson.nodeathscore + scorejson.goldscore;
    return game.model('Game').findOneAndUpdate({
      gameid: game.gameid,
      'players.playergameid': playerstat.playergameid
    }, {
      $set: {
        'players.$.score': scorejson
      }
    }, function(err, doc) {
      if (err) {
        return console.log(err);
      }
    });
  };

  updatescoregame = function(game) {
    var playerstat, _i, _len, _ref, _results;
    _ref = game.players;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      playerstat = _ref[_i];
      console.log('updating score of:' + playerstat['playergameid']);
      _results.push(updatescoreplayer(playerstat, game));
    }
    return _results;
  };

  exports.updatescoregame = updatescoregame;

}).call(this);
