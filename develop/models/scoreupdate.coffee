math = require('mathjs')()
async = require 'async'
scoring = require('./scoring')
mongoose = require 'mongoose'

#mongoose.connect('mongodb://localhost/test')


# scoring.kdascore (kills, deaths, assists, role)
# scoring.partscore (kills, assists, teamkills)
# scoring.goldscore (gold, oppgold)
# scoring.csscore (cs, oppcs, role)


updatekdascore = (playerstat, game) ->
    score = scoring.kdascore(playerstat.kills, playerstat.deaths, playerstat.assists, playerstat.role)
    # if playerstat['player field'] == 'Benny'    
    #     console.log(playerstat)
    #     console.log(score)
    return score
updatepartscore = (playerstat, game) ->
    teamkills = 0
    for player in game.players
        if player.team == playerstat.team
            teamkills += player.kills

    score = scoring.partscore(playerstat.kills, playerstat.assists, teamkills)
    return score

updategoldscore = (playerstat, game) ->
    for player in game.players
        if player.team != playerstat.team & player.role == playerstat.role
            oppgold = player.total_gold
    score = scoring.goldscore(playerstat.total_gold, oppgold)

    return score

updatecsscore = (playerstat, game) ->
    try
        for player in game.players
            if player.team != playerstat.team & player.role == playerstat.role
                oppcs = player.minion_kills
        score = scoring.csscore(playerstat.minion_kills, oppcs, playerstat.role)
    catch error
        console.log(error)
    return score


updatescoreplayer = (playerstat, game) ->
    scorejson = {
        winscore: 0
        nodeathscore: 0
    }

    scorejson.kdascore = updatekdascore(playerstat, game)
    scorejson.partscore = updatepartscore(playerstat, game)
    scorejson.goldscore = updategoldscore(playerstat, game)
    scorejson.csscore = updatecsscore(playerstat, game)
    if playerstat.win == 1
        scorejson.winscore = 0.2
    if playerstat.deaths == 0
        scorejson.nodeathscore = 0.2

    scorejson.totalscore = scorejson.kdascore + scorejson.partscore + scorejson.csscore + scorejson.winscore + scorejson.nodeathscore + scorejson.goldscore
    game.model('Game').findOneAndUpdate(
        {
            gameid: game.gameid,
            'players.playergameid': playerstat.playergameid
        },
        {
            $set: {'players.$.score': scorejson}
        },
            (err, doc)->
                if err
                    console.log(err)
        )



updatescoregame = (game) ->
    for playerstat in game.players
        console.log('updating score of:' + playerstat['playergameid'])
        updatescoreplayer(playerstat, game)

exports.updatescoregame = updatescoregame

# data.Game.findOne({'gameid': 'na1857'}, (err, game)->
#     if err
#         console.log(err)
#     else
#         console.log('updatingscoregame')
#         updatescoregame(game)
#     )