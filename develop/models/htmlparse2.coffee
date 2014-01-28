jsdom = require 'jsdom'
request = require 'request'
mongoose = require 'mongoose'
EventEmitter = require('events').EventEmitter
models = require('./data').models
async = require('async')
jquery = 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'

emitter = new EventEmitter

addplayer = (playerstat, playerid, teamid, game) ->
        # playermodel = new models.Player(
        #                                 playerid: playerid
        #                                 teamid: teamid
        #                                 playername: playerstat['player field']
        #                                 player_fullname: playerstat['player_fullname field']
        #                                 )
        # update = (err, player) ->
        #     console.log('updating')
        #     try
        #         console.log(playerid)
        #         player.save((err, player)->
        #             if err
        #                 console.log(err)
        #             console.log('im here')
        #             game.updateplayerlist(player)
        #             )
        #     catch error
        #         console.log(error + 'happened in addplayer')
        # models.Player.findOneAndUpdate(
        #     {playerid: playerid},
        #     {   
        #         teamid: teamid,
        #         playername: playerstat['player field'],
        #         player_fullname: playerstat['player_fullname field']
        #     },
        #     {upsert:true},
        #     update
        #     )
        
        # log = ()->
        #     console.log('loggings')
        # update = ()->
            
        # async.series([
        #     save1(),
        #     log(),
        #     update()
        #     ])
        


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
                        game = new models.Game(
                            gameid: gameid
                            players: []
                            )

                        console.log('game ' + gameid + ' received')

                        for own teamid, team of gamejson
                            for own playerid, playerstat of gamejson[teamid]


                                game.players.addToSet(playerstat)
                                addplayer(playerstat, playerid, teamid, game)

                                        

                                    

                        game.save((err, game) ->
                                if err?
                                    if err.code == 11000
                                        console.log(err)
                                        console.log(gameid + ' already exists')

                                    else
                                        console.log(err)
                                        console.log('Save failed ' + gameid)
                                else
                                    console.log('game ' + gameid + ' saved')
                                    console.log('updating score')
                                    #updateScore(game)
                            )

                        emitter.emit('next', i + 1, region)
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
        if error
            console.log(error)
    console.log('resetting to ' + 'na:' + naid + ' eu:' + euid )
    models.latestgame.update(
                {id: 'yes'},
                {na: naid, eu: euid},
                {upsert: true}
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