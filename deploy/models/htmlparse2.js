(function() {
  var EventEmitter, addplayer, async, emitter, jquery, jsdom, models, mongoose, queryandretrieveEU, queryandretrieveNA, request, reset, retrieveEU, retrieveNA, retrieveandstore,
    __hasProp = {}.hasOwnProperty;

  jsdom = require('jsdom');

  request = require('request');

  mongoose = require('mongoose');

  EventEmitter = require('events').EventEmitter;

  models = require('./data').models;

  async = require('async');

  jquery = 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js';

  emitter = new EventEmitter;

  addplayer = function(playerstat, playerid, teamid, game) {};

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
        var error, game, gameid, gamejson, page, pagejson, pagetext, playerid, playerstat, region, team, teamid, _ref;
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
            game = new models.Game({
              gameid: gameid,
              players: []
            });
            console.log('game ' + gameid + ' received');
            for (teamid in gamejson) {
              if (!__hasProp.call(gamejson, teamid)) continue;
              team = gamejson[teamid];
              _ref = gamejson[teamid];
              for (playerid in _ref) {
                if (!__hasProp.call(_ref, playerid)) continue;
                playerstat = _ref[playerid];
                game.players.addToSet(playerstat);
                addplayer(playerstat, playerid, teamid, game);
              }
            }
            game.save(function(err, game) {
              if (err != null) {
                if (err.code === 11000) {
                  console.log(err);
                  return console.log(gameid + ' already exists');
                } else {
                  console.log(err);
                  return console.log('Save failed ' + gameid);
                }
              } else {
                console.log('game ' + gameid + ' saved');
                return console.log('updating score');
              }
            });
            return emitter.emit('next', i + 1, region);
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
    cb = function(error, numberAffected, rawResponse) {
      if (error) {
        return console.log(error);
      }
    };
    console.log('resetting to ' + 'na:' + naid + ' eu:' + euid);
    return models.latestgame.update({
      id: 'yes'
    }, {
      na: naid,
      eu: euid
    }, {
      upsert: true
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
