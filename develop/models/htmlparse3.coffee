jsdom = require 'jsdom'
request = require 'request'
mongoose = require 'mongoose'
EventEmitter = require('events').EventEmitter
models = require('./data').models
async = require('async')
jquery = 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'

emitter = new EventEmitter

#calls gameSchema.methods.updateplayerlist
#only updates player and sets references
#use gameSchema.updateplayerlistandstats instead
# addplayer = (playerstat, playerid, teamid, game) ->

#         update = (err, player) ->
#             try
#                 if err
#                     console.log(err)
#                 game.updateplayerlist(player)
#             catch error
#                 console.log(error + 'happened in addplayer')
#         models.Player.findOneAndUpdate(
#             {playerid: playerid},
#             {   
#                 teamid: teamid,
#                 playername: playerstat['player field'],
#                 player_fullname: playerstat['player_fullname field']
#             },
#             {upsert:true},
#             update
#             )
        
        


determineregion = (domain) ->
    if domain.slice(-4, domain.length) < 1781
        region = 'na'
    else if domain.slice(-4, domain.length) > 1799
        region = 'eu'
    return region

parsewindow = (window, region, i) ->
    page = window.$('script:contains("jQuery.extend")')
    pagetext = page.text().slice(31, -2)
    pagejson = JSON.parse(pagetext)
    try
        gameid = Object.keys(pagejson.esportsDataDump.matchDataDump)[0]
        gamejson = pagejson.esportsDataDump.matchDataDump[gameid]

        console.log('game ' + gameid + region + ' received')
        emitter.emit('next', i + 1, region)
        return {
            gamejson: gamejson
            gameid: gameid
        }
    catch error
        console.log('no game found')
        emitter.emit('not found', region)
        return null
    
store = (gamejson, gameid, i, region, gameidnoregion) ->
    process = (err, game)->
        if err
            if err.code == 11000
                console.log('game already exists')
            console.log(err)
        else
            console.log('storing: ' + gameid)
            for own teamid, team of gamejson
                for own playerid, playerstat of gamejson[teamid]
                    game.updateplayerlistandstat(playerstat, playerid, teamid, game, region, gameidnoregion)


    models.Game.findOneAndUpdate(
        {gameid: gameid},
        {
        region: region,
        gameidnoregion: gameidnoregion
        },
        {upsert: true},
        process
    )

retrieve = (domain, i) ->
        console.log('retrieving ' + domain)
        features = 
            FetchExternalResources: false
            ProcessExternalResources: false

        config = 
            url: domain
            scripts: [jquery]
            features: features
            done: (errors, window) ->
                region = determineregion(domain)
                try
                    parsed = parsewindow(window, region, i)
                    if parsed?
                        gameid = region + parsed.gameid
                        gameidnoregion = parsed.gameid
                        store(parsed.gamejson, gameid, i, region, gameidnoregion)
                catch error
                    console.log(error + 'retrieve')
                    


        return jsdom.env(config)

retrieveNA = (err, latest) ->
    i = latest.na 
    console.log('retrieving NA' + i)
    prefix = 'http://na.lolesports.com/tourney/match/'
    domain = prefix + i
    retrieve(domain, i)

retrieveEU = (err, latest) ->
    i = latest.eu
    console.log('retrieving EU' + i)
    prefix = 'http://na.lolesports.com/tourney/match/'
    domain = prefix + i
    retrieve(domain, i)


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

updatescoresregion = (region) ->
                models.Game.find({region: region}, (err, docs)->
                    if err
                        console.log(err)
                    else
                        for game in docs

                            game.updatescore()
                    )

emitter.on('not found', 
    (region) ->
        console.log(region + ' up to date')
        emitter.emit('updatescore', region)
    

    )

emitter.on('updatescore',
    (region)->
        updatescoresregion(region)
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
                updatescoresregion: updatescoresregion