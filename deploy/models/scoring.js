(function() {
  var csscore, goldscore, kdascore, math, models, partscore;

  math = require('mathjs')();

  models = require('./data').models;

  kdascore = function(kills, deaths, assists, role) {
    var scope, score;
    scope = {
      k: kills,
      d: deaths,
      a: assists
    };
    switch (role) {
      case 'top':
        score = math["eval"]('0.5 * ((2*k + a)/(d + 10))', scope);
        break;
      case 'jungle':
        score = math["eval"]('0.5 * ((2*k + 2*a)/(d + 10))', scope);
        break;
      case 'mid':
        score = math["eval"]('0.5 * ((2*k + a)/(d + 10))', scope);
        break;
      case 'adc':
        score = math["eval"]('0.5 * ((2*k + a)/(d + 10))', scope);
        break;
      case 'support':
        score = math["eval"]('0.5 * ((1.5*k + 2*a)/(d + 10))', scope);
    }
    return score;
  };

  partscore = function(kills, assists, teamkills) {
    var scope, score;
    if (teamkills === 0) {
      return 0;
    } else {
      scope = {
        k: kills,
        a: assists,
        tk: teamkills
      };
      score = math["eval"]('(k + a)/tk', scope);
      return score;
    }
  };

  csscore = function(cs, oppcs, role) {
    var scope, score;
    scope = {
      cs: cs,
      oppcs: oppcs
    };
    switch (role) {
      case 'top':
      case 'jungle':
      case 'mid':
        score = math["eval"]('cs/(200 + oppcs)', scope);
        break;
      case 'adc':
      case 'support':
        score = math["eval"]('cs/(75 + oppcs)', scope);
    }
    return score;
  };

  goldscore = function(gold, totalgold, oppgold) {
    var scope, score;
    scope = {
      gold: gold,
      totalgold: totalgold,
      oppgold: oppgold
    };
    score = math["eval"]('(5 * (2*gold - oppgold)) / (totalgold)', scope);
    return score;
  };

  exports.kdascore = kdascore;

  exports.partscore = partscore;

  exports.goldscore = goldscore;

  exports.csscore = csscore;

}).call(this);
