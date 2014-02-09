math = require('mathjs')()
models = require('./data').models

kdascore = (kills, deaths, assists, role) ->
    scope =
        k: kills
        d: deaths
        a: assists
    switch role
        when 'top'
            score = math.eval('0.5 * ((2*k + a)/(d + 10))', scope)
        when 'jungle'
            score = math.eval('0.5 * ((2*k + 2*a)/(d + 10))', scope)
        when 'mid'
            score = math.eval('0.5 * ((2*k + a)/(d + 10))', scope)
        when 'adc'
            score = math.eval('0.5 * ((2*k + a)/(d + 10))', scope)
        when 'support'
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
    switch role
        when 'top', 'jungle', 'mid'
            score = math.eval('cs/(200 + oppcs)', scope)
        when 'adc', 'support'
            score = math.eval('cs/(75 + oppcs)', scope)

    return score

goldscore = (gold, totalgold, oppgold) ->
    scope = 
        gold: gold
        totalgold: totalgold
        oppgold: oppgold

    score = math.eval('(5 * (2*gold - oppgold)) / (totalgold)', scope)

    return score




exports.kdascore = kdascore
exports.partscore = partscore
exports.goldscore = goldscore
exports.csscore = csscore


