(function() {
  var EventEmitter, async, determineregion, emitter, jquery, jsdom, models, mongoose, parsewindow, queryandretrieveEU, queryandretrieveNA, request, reset, retrieve, retrieveEU, retrieveNA, store, updatescoresregion,
    __hasProp = {}.hasOwnProperty;

  jsdom = require('jsdom');

  request = require('request');

  mongoose = require('mongoose');

  EventEmitter = require('events').EventEmitter;

  models = require('./data').models;

  async = require('async');

  jquery = 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js';

  emitter = new EventEmitter;

  determineregion = function(domain) {
    var region;
    if (domain.slice(-4, domain.length) < 1781) {
      region = 'na';
    } else if (domain.slice(-4, domain.length) > 1799) {
      region = 'eu';
    }
    return region;
  };

  parsewindow = function(window, region, i) {
    var error, gameid, gamejson, page, pagejson, pagetext;
    page = window.$('script:contains("jQuery.extend")');
    pagetext = page.text().slice(31, -2);
    pagejson = JSON.parse(pagetext);
    try {
      gameid = Object.keys(pagejson.esportsDataDump.matchDataDump)[0];
      gamejson = pagejson.esportsDataDump.matchDataDump[gameid];
      console.log('game ' + gameid + region + ' received');
      emitter.emit('next', i + 1, region);
      return {
        gamejson: gamejson,
        gameid: gameid
      };
    } catch (_error) {
      error = _error;
      console.log('no game found');
      emitter.emit('not found', region);
      return null;
    }
  };

  store = function(gamejson, gameid, i, region, gameidnoregion) {
    var process;
    process = function(err, game) {
      var playerid, playerstat, team, teamid, _results;
      if (err) {
        if (err.code === 11000) {
          console.log('game already exists');
        }
        return console.log(err);
      } else {
        console.log('storing: ' + gameid);
        _results = [];
        for (teamid in gamejson) {
          if (!__hasProp.call(gamejson, teamid)) continue;
          team = gamejson[teamid];
          _results.push((function() {
            var _ref, _results1;
            _ref = gamejson[teamid];
            _results1 = [];
            for (playerid in _ref) {
              if (!__hasProp.call(_ref, playerid)) continue;
              playerstat = _ref[playerid];
              _results1.push(game.updateplayerlistandstat(playerstat, playerid, teamid, game, region, gameidnoregion));
            }
            return _results1;
          })());
        }
        return _results;
      }
    };
    return models.Game.findOneAndUpdate({
      gameid: gameid
    }, {
      region: region,
      gameidnoregion: gameidnoregion
    }, {
      upsert: true
    }, process);
  };

  retrieve = function(domain, i) {
    var config, features;
    console.log('retrieving ' + domain);
    features = {
      FetchExternalResources: false,
      ProcessExternalResources: false
    };
    config = {
      url: domain,
      scripts: [jquery],
      features: features,
      done: function(errors, window) {
        var error, gameid, gameidnoregion, parsed, region;
        region = determineregion(domain);
        try {
          parsed = parsewindow(window, region, i);
          if (parsed != null) {
            gameid = region + parsed.gameid;
            gameidnoregion = parsed.gameid;
            return store(parsed.gamejson, gameid, i, region, gameidnoregion);
          }
        } catch (_error) {
          error = _error;
          return console.log(error + 'retrieve');
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
    return retrieve(domain, i);
  };

  retrieveEU = function(err, latest) {
    var domain, i, prefix;
    i = latest.eu;
    console.log('retrieving EU' + i);
    prefix = 'http://na.lolesports.com/tourney/match/';
    domain = prefix + i;
    return retrieve(domain, i);
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

  updatescoresregion = function(region) {
    return models.Game.find({
      region: region
    }, function(err, docs) {
      var game, _i, _len, _results;
      if (err) {
        return console.log(err);
      } else {
        _results = [];
        for (_i = 0, _len = docs.length; _i < _len; _i++) {
          game = docs[_i];
          _results.push(game.updatescore());
        }
        return _results;
      }
    });
  };

  emitter.on('not found', function(region) {
    console.log(region + ' up to date');
    return emitter.emit('updatescore', region);
  });

  emitter.on('updatescore', function(region) {
    return updatescoresregion(region);
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
    reset: reset,
    updatescoresregion: updatescoresregion
  };

}).call(this);
