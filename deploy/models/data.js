(function() {
  var EventEmitter, Game, Player, Schema, User, gameSchema, latestGame, latestgameSchema, mongoose, passportLocalMongoose, playerSchema, players, updatescoregame, userSchema, _playergameSchema;

  mongoose = require('mongoose');

  players = require('./playerinfo').players;

  updatescoregame = require('./scoreupdate').updatescoregame;

  Schema = mongoose.Schema;

  EventEmitter = require('events').EventEmitter;

  passportLocalMongoose = require('passport-local-mongoose');

  _playergameSchema = new Schema({
    playergameid: {
      type: String,
      unique: true
    },
    role: String,
    team: String,
    win: Number,
    'player field': String,
    'player_fullname field': String,
    champion: Array,
    champion_level: Number,
    champion: Array,
    champion_level: Number,
    kills: Number,
    deaths: Number,
    assists: Number,
    total_gold: Number,
    minion_kills: Number,
    score: {
      kdascore: Number,
      partscore: Number,
      goldscore: Number,
      csscore: Number,
      nodeathscore: Number,
      winscore: Number,
      MVPscore: Number,
      totalscore: Number
    }
  });

  _playergameSchema.set('_id', false);

  gameSchema = new Schema({
    gameid: {
      type: Schema.Types.Mixed,
      unique: true
    },
    gameidnoregion: Number,
    players: [_playergameSchema],
    gamelength: Number,
    region: String,
    playerlist: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player'
      }
    ]
  });

  gameSchema.set('versionKey', false);

  playerSchema = new Schema({
    playerid: {
      type: Number,
      unique: true
    },
    teamid: Number,
    teamname: String,
    playername: String,
    player_fullname: String,
    role: String,
    totalkdascore: Number,
    totalpartscore: Number,
    totalgpmscore: Number,
    totalCSscore: Number,
    totalnodeathscore: Number,
    totalwinscore: Number,
    totalMVPscore: Number,
    totalscore: Number,
    mostrecentgameid: Number,
    mostrecentgame: {
      type: Schema.Types.ObjectId,
      ref: 'Game'
    },
    gamesplayed: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Game'
      }
    ]
  });

  userSchema = new Schema({
    email: String,
    roster: {
      top: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
      },
      mid: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
      },
      jungle: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
      },
      adc: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
      },
      support: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
      }
    }
  });

  userSchema.plugin(passportLocalMongoose);

  latestgameSchema = new Schema({
    eu: Number,
    na: Number,
    id: {
      type: String,
      unique: true
    }
  });

  userSchema["static"]('sendgames', function(req, res) {
    var callback;
    callback = function(err, user) {
      console.log(user);
      if (err !== null) {
        return res.send(err);
      } else if (user[0].roster.length === 0) {
        return res.send('noroster');
      } else {
        return res.JSON(user.roster);
      }
    };
    return this.findOne({
      "username": req.body.username
    }).populate('roster.top').populate('roster.mid').populate('roster.jungle').populate('roster.adc').populate('roster.support').exec(function(err, doc) {
      return res.JSON(doc);
    });
  });

  gameSchema.methods.updatescore = function() {
    return updatescoregame(this);
  };

  gameSchema.methods.updateplayerlistandstat = function(playerstat, playerid, teamid, game, region, gameidnoregion) {
    var addplayer;
    addplayer = function(playerstat, playerid, teamid, game) {
      var error, update;
      update = function(err, player) {
        var error;
        try {
          if (err) {
            console.log(err + 'happened at tryif update addplayer');
          }
          game.playerlist.addToSet(player);
          player.gamesplayed.addToSet(game);
          if (player.mostrecentgameid < gameidnoregion || player.mostrecentgameid === void 0) {
            player.mostrecentgameid = gameidnoregion;
            player.mostrecentgame = game;
          }
          playerstat['playergameid'] = game.gameid + player.playername;
          playerstat['team'] = players[playerstat['player field']][1];
          playerstat['role'] = players[playerstat['player field']][0];
          if (game.players.length < 10) {
            game.players.addToSet(playerstat);
          }
          player.save(function(err, player) {
            if (err) {
              console.log('player.save at schema methods' + err);
              return console.log(err);
            } else {
              return console.log('playersaved ' + playerstat.playergameid);
            }
          });
          return game.save(function(err, game) {
            if (err) {
              console.log('this.save at schema methods' + err);
              return console.log(err);
            } else {
              return console.log('gamesaved ' + game.gameid + ' with ' + playerstat.playergameid);
            }
          });
        } catch (_error) {
          error = _error;
          return console.log(error + 'happened in addplayer');
        }
      };
      try {
        return Player.findOneAndUpdate({
          playerid: playerid
        }, {
          teamid: teamid,
          playername: playerstat['player field'],
          player_fullname: playerstat['player_fullname field'],
          role: players[playerstat['player field']][0],
          teamname: players[playerstat['player field']][1]
        }, {
          upsert: true
        }, update);
      } catch (_error) {
        error = _error;
        return console.log(error + ' at ' + playerstat['player field']);
      }
    };
    return addplayer(playerstat, playerid, teamid, game);
  };

  gameSchema.methods.updateplayerlist = function(player) {
    this.playerlist.addToSet(player);
    player.gamesplayed.addToSet(this);
    player.save(function(err) {
      if (err) {
        console.log('player.save at schema methods' + err);
        return console.log(err);
      }
    });
    return this.save(function(err) {
      if (err) {
        return console.log('this.save at schema methods' + err);
      }
    });
  };

  gameSchema.methods.addplayerstat = function(playerstat) {
    this.players.addToSet(playerstat);
    return this.save(function(err) {
      if (err instanceof mongoose.Error.VersionError) {
        console.log('game.save at schema methods' + err);
        return this.addplayerstat(playerstat);
      }
    });
  };

  Game = mongoose.model('Game', gameSchema);

  User = mongoose.model('User', userSchema);

  Player = mongoose.model('Player', playerSchema);

  latestGame = mongoose.model('latestGame', latestgameSchema);

  exports.models = {
    Player: Player,
    Game: Game,
    User: User,
    latestgame: latestGame,
    Schemas: {
      userSchema: userSchema,
      latestgameSchema: latestgameSchema
    }
  };

}).call(this);
