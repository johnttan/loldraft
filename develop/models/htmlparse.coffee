jsdom = require 'jsdom'
request = require 'request'
mongoose = require 'mongoose'
EventEmitter = require('events').EventEmitter
models = require('./data').models
jquery = 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'


emitter = new EventEmitter

addplayer = (player, playerid, teamid) ->
        playermodel = new models.Player(
                                        playerid: playerid
                                        teamid: teamid
                                        playername: player['player field']
                                        player_fullname: player['player_fullname field']
                                        )
        playermodel.save()



addgametoplayer = (playerid, gamemodel) ->
        callback = (err, player) ->
            player.gamesplayed.addToSet(gamemodel)
            player.save()

            gamemodel.playerlist.addToSet(player)
            gamemodel.save((err, game) ->
                if err
                    console.log(err)
                )

        models.Player.findOne({'playerid': playerid}, callback)


retrieveandstore = (domain, i) ->

        features = 
            FetchExternalResources: false
            ProcessExternalResources: false

        config = 
            url: domain
            scripts: [jquery]
            features: features
            done: (errors, window) ->
                try
                    if errors
                        console.log('Failed retrieve' + errors)
                    else
                        if domain.slice(-4, domain.length) < 1781
                            region = 'na'
                        else if domain.slice(-4, domain.length) > 1799
                            region = 'eu'

                        page = window.$('script:contains("jQuery.extend")')
                        pagetext = page.text().slice(31, -2)
                        pagejson = JSON.parse(pagetext)

                        gameid = Object.keys(pagejson.esportsDataDump.matchDataDump)[0]
                        gamejson = pagejson.esportsDataDump.matchDataDump[gameid]
                        gameid = region + gameid
                        console.log(gameid)
                        pop = (err, gamemodel) ->
                            if err
                                console.log('update error:' + err)
                            #console.log(gamemodel)
                            console.log(gamemodel.gameid)
                            console.log('game ' + gameid + region + ' received')

                            for own teamid, team of gamejson
                                for own playerid, player of gamejson[teamid]
                                    gamemodel.players.addToSet(player)
                                    addplayer(player, playerid, teamid)

                                    #addgametoplayer(playerid, gamemodel)
                                    

                            gamemodel.save((err, game) ->
                                    if err?
                                        if err.code == 11000
                                            console.log(gameid + ' already exists')

                                        else
                                            console.log(err)
                                            console.log('Save failed ' + gameid)
                                    else
                                        console.log('game ' + gameid + ' saved')
                                        console.log('updating score')

                                        # updateScore(game)
                                        emitter.emit('next', i + 1, region)
                            )

                        models.Game.findOneAndUpdate({gameid:gameid}, {gameid: gameid}, {upsert: true}, pop)
                            
                        
                catch error
                    console.log(error)
                    console.log('No further games to process')
                    emitter.emit('latest game', i, region)






        return jsdom.env(config)



retrieveNA = (err, latest) ->
    i = latest.na 
    console.log('retrieving NA' + i)
    prefix = 'http://na.lolesports.com/tourney/match/'
    domain = prefix + i
    retrieveandstore(domain, i)

retrieveEU = (err, latest) ->
    i = latest.eu
    console.log('retrieving EU' + i)
    prefix = 'http://na.lolesports.com/tourney/match/'
    domain = prefix + i
    retrieveandstore(domain, i)


queryandretrieveNA = () ->
    models.latestgame.findOne({id: 'yes'},
            retrieveNA
            )
queryandretrieveEU = () ->
    models.latestgame.findOne({id: 'yes'},
            retrieveEU
            )


# urlna = [1669, 1780]
# urleu = [1800, 1911]

reset = (naid, euid) ->
    cb = (error, numberAffected, rawResponse) ->
    console.log('resetting to ' + 'na:' + naid + ' eu:' + euid )
    models.latestgame.update(
                {id: 'yes'},
                {na: naid, eu: euid},
                cb
        )



emitter.on('latest game', (i, region) ->
    if region == 'na'
        models.latestgame.update(
            {na: i}
            )
    else if region == 'eu'
        models.latestgame.update(
            {eu: i}
            )

    )

emitter.on('next', (i, region) ->

    if region == 'na'
        models.latestgame.update(
            {id: 'yes'},
            {na: i},
            queryandretrieveNA
            )

    else if region == 'eu'
        models.latestgame.update(
            {id: 'yes'},
            {eu: i},
            queryandretrieveEU
            )
    )

# mongoose.connect('mongodb://localhost/test')
# reset(1669, 1800)

# queryandretrieveNA()
# queryandretrieveEU()


exports.queryandretrieve = 
                NA: queryandretrieveNA
                EU: queryandretrieveEU
                reset: reset