(function() {
  var EventEmitter, addgametoplayer, addplayer, emitter, jquery, jsdom, models, mongoose, queryandretrieveEU, queryandretrieveNA, request, reset, retrieveEU, retrieveNA, retrieveandstore,
    __hasProp = {}.hasOwnProperty;

  jsdom = require('jsdom');

  request = require('request');

  mongoose = require('mongoose');

  EventEmitter = require('events').EventEmitter;

  models = require('./data').models;

  jquery = 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js';

  emitter = new EventEmitter;

  addplayer = function(player, playerid, teamid) {
    var playermodel;
    playermodel = new models.Player({
      playerid: playerid,
      teamid: teamid,
      playername: player['player field'],
      player_fullname: player['player_fullname field']
    });
    return playermodel.save();
  };

  addgametoplayer = function(playerid, gamemodel) {
    var callback;
    callback = function(err, player) {
      player.gamesplayed.addToSet(gamemodel);
      player.save();
      gamemodel.playerlist.addToSet(player);
      return gamemodel.save(function(err, game) {
        if (err) {
          return console.log(err);
        }
      });
    };
    return models.Player.findOne({
      'playerid': playerid
    }, callback);
  };

  retrieveandstore = function(domain, i) {
    var config, features;
    features = {
      FetchExternalResources: false,
      ProcessExternalResources: false
    };
    config = {
      url: domain,
      scripts: [jquery],
      features: features,
      done: function(errors, window) {
        var error, gameid, gamejson, page, pagejson, pagetext, pop, region;
        try {
          if (errors) {
            return console.log('Failed retrieve' + errors);
          } else {
            if (domain.slice(-4, domain.length) < 1781) {
              region = 'na';
            } else if (domain.slice(-4, domain.length) > 1799) {
              region = 'eu';
            }
            page = window.$('script:contains("jQuery.extend")');
            pagetext = page.text().slice(31, -2);
            pagejson = JSON.parse(pagetext);
            gameid = Object.keys(pagejson.esportsDataDump.matchDataDump)[0];
            gamejson = pagejson.esportsDataDump.matchDataDump[gameid];
            gameid = region + gameid;
            console.log(gameid);
            pop = function(err, gamemodel) {
              var player, playerid, team, teamid, _ref;
              if (err) {
                console.log('update error:' + err);
              }
              console.log(gamemodel.gameid);
              console.log('game ' + gameid + region + ' received');
              for (teamid in gamejson) {
                if (!__hasProp.call(gamejson, teamid)) continue;
                team = gamejson[teamid];
                _ref = gamejson[teamid];
                for (playerid in _ref) {
                  if (!__hasProp.call(_ref, playerid)) continue;
                  player = _ref[playerid];
                  gamemodel.players.addToSet(player);
                  addplayer(player, playerid, teamid);
                }
              }
              return gamemodel.save(function(err, game) {
                if (err != null) {
                  if (err.code === 11000) {
                    return console.log(gameid + ' already exists');
                  } else {
                    console.log(err);
                    return console.log('Save failed ' + gameid);
                  }
                } else {
                  console.log('game ' + gameid + ' saved');
                  console.log('updating score');
                  return emitter.emit('next', i + 1, region);
                }
              });
            };
            return models.Game.findOneAndUpdate({
              gameid: gameid
            }, {
              gameid: gameid
            }, {
              upsert: true
            }, pop);
          }
        } catch (_error) {
          error = _error;
          console.log(error);
          console.log('No further games to process');
          return emitter.emit('latest game', i, region);
        }
      }
    };
    return jsdom.env(config);
  };

  retrieveNA = function(err, latest) {
    var domain, i, prefix;
    i = latest.na;
    console.log('retrieving NA' + i);
    prefix = 'http://na.lolesports.com/tourney/match/';
    domain = prefix + i;
    return retrieveandstore(domain, i);
  };

  retrieveEU = function(err, latest) {
    var domain, i, prefix;
    i = latest.eu;
    console.log('retrieving EU' + i);
    prefix = 'http://na.lolesports.com/tourney/match/';
    domain = prefix + i;
    return retrieveandstore(domain, i);
  };

  queryandretrieveNA = function() {
    return models.latestgame.findOne({
      id: 'yes'
    }, retrieveNA);
  };

  queryandretrieveEU = function() {
    return models.latestgame.findOne({
      id: 'yes'
    }, retrieveEU);
  };

  reset = function(naid, euid) {
    var cb;
    cb = function(error, numberAffected, rawResponse) {};
    console.log('resetting to ' + 'na:' + naid + ' eu:' + euid);
    return models.latestgame.update({
      id: 'yes'
    }, {
      na: naid,
      eu: euid
    }, cb);
  };

  emitter.on('latest game', function(i, region) {
    if (region === 'na') {
      return models.latestgame.update({
        na: i
      });
    } else if (region === 'eu') {
      return models.latestgame.update({
        eu: i
      });
    }
  });

  emitter.on('next', function(i, region) {
    if (region === 'na') {
      return models.latestgame.update({
        id: 'yes'
      }, {
        na: i
      }, queryandretrieveNA);
    } else if (region === 'eu') {
      return models.latestgame.update({
        id: 'yes'
      }, {
        eu: i
      }, queryandretrieveEU);
    }
  });

  exports.queryandretrieve = {
    NA: queryandretrieveNA,
    EU: queryandretrieveEU,
    reset: reset
  };

}).call(this);
