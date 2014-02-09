(function() {
  var EventEmitter, Game, Player, Schema, User, db, gameSchema, mongoose, passportLocalMongoose, playerSchema, userSchema;

  mongoose = require('mongoose');

  Schema = mongoose.Schema;

  EventEmitter = require('events').EventEmitter;

  passportLocalMongoose = require('passport-local-mongoose');

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error'));

  playerSchema = new Schema({
    any: {}
  });

  userSchema = new Schema({
    email: String,
    roster: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player'
      }
    ],
    rosterarray: Array
  });

  userSchema.plugin(passportLocalMongoose);

  gameSchema = new Schema({
    any: {}
  });

  Game = mongoose.model('Game', gameSchema, 'Games');

  User = mongoose.model('User', userSchema);

  Player = mongoose.model('Player', playerSchema, 'Players');

  exports.models = {
    Player: Player,
    Game: Game,
    User: User
  };

}).call(this);
