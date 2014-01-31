mongoose = require 'mongoose'
players = require('./playerinfo').players
updatescoregame = require('./scoreupdate').updatescoregame
Schema = mongoose.Schema
EventEmitter = require('events').EventEmitter
passportLocalMongoose = require('passport-local-mongoose')


_playergameSchema = new Schema(
    playergameid: {type: String, unique: true}
    role: String
    team: String
    win: Number
    'player field': String
    'player_fullname field': String
    champion: Array
    champion_level: Number
    champion: Array
    champion_level: Number
    kills: Number
    deaths: Number
    assists: Number
    total_gold: Number
    minion_kills: Number
    score: 
        kdascore: Number,
        partscore: Number,
        goldscore: Number,
        csscore: Number,
        nodeathscore: Number,
        winscore: Number,
        MVPscore: Number,
        totalscore: Number
    )
_playergameSchema.set('_id', false)



gameSchema = new Schema(
    gameid: {type: Schema.Types.Mixed, unique: true},
    gameidnoregion: Number
    players: [_playergameSchema]
    gamelength: Number
    region: String
    playerlist: [{type: Schema.Types.ObjectId, ref: 'Player'}]
)
gameSchema.set('versionKey', false)





playerSchema = new Schema(
    playerid: {type: Number, unique: true},
    teamid: Number,
    teamname: String,
    playername: String,
    player_fullname: String,
    role: String,
    totalkdascore: Number,
    kdadelta: Number,
    totalpartscore: Number,
    partdelta: Number,
    totalgpmscore: Number,
    gpmdelta: Number,
    totalcsscore: Number,
    csdelta: Number
    totalnodeathscore: Number,
    totalwinscore: Number,
    totalMVPscore: Number,
    totalscore: Number,
    totaldelta: Number
    mostrecentgameid: Number,
    gamesplayedbyid: Array,
    mostrecentgame: {type: Schema.Types.ObjectId, ref: 'Game'}
    mostrecentgamestat: Schema.Types.Mixed
    gamesplayed: [{type: Schema.Types.ObjectId, ref: 'Game'}]
    owner: {type: Schema.Types.ObjectId, ref: 'User'}
    )



userSchema = new Schema(
    email: String,
    roster: [{type: Schema.Types.ObjectId, ref: 'Player'}]
    rosterarray: Array
    )
userSchema.plugin(passportLocalMongoose)

latestgameSchema = new Schema(
    eu: Number
    na: Number
    id: {type:String, unique: true}
    )


gameSchema.statics.aggregatescore = ()->
    this.find({}, (err, games)->
                    console.log(games)
                    if err
                        return console.log(err)
                    games.forEach((game)->
                        game.players.forEach((playergame)->
                            Player.findOne(
                                {'playername': playergame['player field']},
                                (err, player)->
                                            if err
                                                return console.log(err)
                                            console.log(player.playername + 'aggregating score')
                                            player.totalkdascore += playergame.score.kdascore
                                            player.totalpartscore += playergame.score.partscore
                                            player.totalgpmscore += playergame.score.goldscore
                                            player.totalcsscore += playergame.score.csscore
                                            player.totalnodeathscore += playergame.score.nodeathscore
                                            player.totalMVPscore += playergame.score.MVPscore
                                            player.totalscore += playergame.score.totalscore
                                            player.save()
                                        ))              )
            )

userSchema.methods.sendgames = (req, res)->

    this.findOne({"username": req.body.username})
        .populate('roster.top')
        .populate('roster.mid')
        .populate('roster.jungle')
        .populate('roster.adc')
        .populate('roster.support')
        .exec((err,doc)->
            res.JSON(doc)
        )


# totalkdascore: Number,
# totalpartscore: Number,
# totalgpmscore: Number,
# totalCSscore: Number,
# totalnodeathscore: Number,
# totalwinscore: Number,
# totalMVPscore: Number,
# totalscore: Number,

gameSchema.methods.updatescore = ()->
    updatescoregame(this)

gameSchema.methods.updateplayerlistandstat = (playerstat, playerid, teamid, game, region, gameidnoregion)->
    addplayer = (playerstat, playerid, teamid, game) ->
        update = (err, player) ->
            try
                if err
                    console.log(err + 'happened at tryif update addplayer')
                game.playerlist.addToSet(player)
                player.gamesplayed.addToSet(game)
                #checks if this is most recent game played
                if player.mostrecentgameid <= gameidnoregion or player.mostrecentgameid == undefined
                    player.mostrecentgameid = gameidnoregion
                    player.mostrecentgame = game
                    player.mostrecentgamestat = game 
                player.gamesplayedbyid.push(gameidnoregion)
                playerstat['playergameid'] = game.gameid + player.playername
                playerstat['team'] = players[playerstat['player field']][1]
                playerstat['role'] = players[playerstat['player field']][0]
                if game.players.length < 10
                    game.players.addToSet(playerstat)


                player.save(
                    (err, player)->
                        if err
                            console.log('player.save at schema methods' + err)
                            console.log(err)
                        else
                            console.log('playersaved ' + playerstat.playergameid)
                    )


                game.save(
                    (err, game)->
                        if err
                            console.log('this.save at schema methods' + err)
                            console.log(err)
                        else
                            console.log('gamesaved ' + game.gameid + ' with ' + playerstat.playergameid)

                )

            catch error
                console.log(error + 'happened in addplayer')

        try

            Player.findOneAndUpdate(
                {playerid: playerid},
                {   
                    teamid: teamid,
                    playername: playerstat['player field'],
                    player_fullname: playerstat['player_fullname field'],
                    role: players[playerstat['player field']][0],
                    teamname: players[playerstat['player field']][1]
                },
                {upsert:true},
                update
                )
        catch error
            console.log(error + ' at ' + playerstat['player field'])

    addplayer(playerstat, playerid, teamid, game)


gameSchema.methods.updateplayerlist = (player)->
    this.playerlist.addToSet(player)
    player.gamesplayed.addToSet(this)

    player.save((err)->
        if err
            console.log('player.save at schema methods' + err)
            console.log(err)
        )
    this.save((err)->
        if err
            console.log('this.save at schema methods' + err)
        )

gameSchema.methods.addplayerstat = (playerstat)->
    this.players.addToSet(playerstat)
    this.save((err)->
        if err instanceof mongoose.Error.VersionError
            console.log('game.save at schema methods' + err)
            this.addplayerstat(playerstat)
        )

_playergame = mongoose.model('_playergame', _playergameSchema)
Game = mongoose.model('Game', gameSchema)

User = mongoose.model('User', userSchema)

Player = mongoose.model('Player', playerSchema)

latestGame =  mongoose.model('latestGame', latestgameSchema)

exports.models =
    Player: Player
    Game: Game
    User: User
    latestgame: latestGame
    _playergame: _playergame
    Schemas:
        userSchema: userSchema
        latestgameSchema: latestgameSchema



   
        
