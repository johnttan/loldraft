math = require('mathjs')()
models = require('./data').models

kdascore = (kills, deaths, assists, role) ->
    scope =
        k: kills
        d: deaths
        a: assists
    
    if role == 'top'
        score = math.eval('0.5 * ((2*k + a)/(d + 10))', scope)
    else if role == 'jungle'
        score = math.eval('0.5 * ((2*k + 2*a)/(d + 10))', scope)
    else if role == 'mid'
        score = math.eval('0.5 * ((2*k + a)/(d + 10))', scope)
    else if role == 'adc'
        score = math.eval('0.5 * ((2*k + a)/(d + 10))', scope)
    else if role == 'support'
        score = math.eval('0.5 * ((1.5*k + 2*a)/(d + 10))', scope)

    return score


partscore = (kills, assists, teamkills) ->
    if teamkills == 0
        return 0
    else
        scope =
            k: kills
            a: assists
            tk: teamkills

        score = math.eval('(k + a)/tk', scope)

        return score

csscore = (cs, oppcs, role) ->

    scope = 
        cs: cs
        oppcs: oppcs

    if role == 'top' || role == 'jungle' || role == 'mid'
        score = math.eval('cs/(200 + oppcs)', scope)
    else if role == 'adc' || role == 'support'
        score = math.eval('cs/(75 + oppcs)', scope)

    return score

goldscore = (gold, oppgold) ->
    scope = 
        gold: gold
        oppgold: oppgold

    score = math.eval('(10 * (gold - oppgold)) / (gold + oppgold)', scope)

    return score




exports.kdascore = kdascore
exports.partscore = partscore
exports.goldscore = goldscore
exports.csscore = csscore


