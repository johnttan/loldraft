(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $(function() {
    var adcplayers, calcdelta, draftteam, info, jungleplayers, key, midplayers, playerinfo, populateroster, processRegistration, processSuccessDraft, setupauto, supportplayers, topplayers, validator;
    playerinfo = {
      Cruzerthebruzer: ['top', 'Dignitas'],
      Crumbzz: ['jungle', 'Dignitas'],
      Scarra: ['mid', 'Dignitas'],
      Imaqtpie: ['adc', 'Dignitas'],
      KiWiKiD: ['support', 'Dignitas'],
      Balls: ['top', 'Cloud 9'],
      Meteos: ['jungle', 'Cloud 9'],
      Hai: ['mid', 'Cloud 9'],
      Sneaky: ['adc', 'Cloud 9'],
      LemonNation: ['support', 'Cloud 9'],
      Dyrus: ['top', 'TSM'],
      TheOddOne: ['jungle', 'TSM'],
      Bjergsen: ['mid', 'TSM'],
      WildTurtle: ['adc', 'TSM'],
      Xpecial: ['support', 'TSM'],
      Nien: ['top', 'CLG'],
      Link: ['jungle', 'CLG'],
      HotshotGG: ['mid', 'CLG'],
      Doublelift: ['adc', 'CLG'],
      Aphromoo: ['support', 'CLG'],
      Innox: ['top', 'Evil Geniuses'],
      Snoopeh: ['jungle', 'Evil Geniuses'],
      Pobelter: ['mid', 'Evil Geniuses'],
      Yellowpete: ['adc', 'Evil Geniuses'],
      Krepo: ['support', 'Evil Geniuses'],
      Benny: ['top', 'XDG'],
      Zuna: ['jungle', 'XDG'],
      mancloud: ['mid', 'XDG'],
      Xmithie: ['adc', 'XDG'],
      BloodWater: ['support', 'XDG'],
      ZionSpartan: ['top', 'Coast'],
      NintendudeX: ['jungle', 'Coast'],
      Shiphtur: ['mid', 'Coast'],
      WizFujiiN: ['adc', 'Coast'],
      Daydreamin: ['support', 'Coast'],
      Quas: ['top', 'Curse'],
      IWillDominate: ['jungle', 'Curse'],
      Voyboy: ['mid', 'Curse'],
      Cop: ['adc', 'Curse'],
      Zekent: ['support', 'Curse'],
      Wickd: ['top', 'Alliance'],
      Shook: ['jungle', 'Alliance'],
      Froggen: ['mid', 'Alliance'],
      Tabzz: ['adc', 'Alliance'],
      Nyph: ['support', 'Alliance'],
      sOAZ: ['top', 'Fnatic'],
      Cyanide: ['jungle', 'Fnatic'],
      xPeke: ['mid', 'Fnatic'],
      Rekkles: ['adc', 'Fnatic'],
      YellOwStaR: ['support', 'Fnatic'],
      Kev1n: ['top', 'Millenium'],
      Araneae: ['jungle', 'Millenium'],
      Kerp: ['mid', 'Millenium'],
      Creaton: ['adc', 'Millenium'],
      Jree: ['support', 'Millenium'],
      Xaxus: ['top', 'ROCCAT'],
      Jankos: ['jungle', 'ROCCAT'],
      Overpow: ['mid', 'ROCCAT'],
      Celaver: ['adc', 'ROCCAT'],
      VandeR: ['support', 'ROCCAT'],
      Darien: ['top', 'Gambit'],
      Diamond: ['jungle', 'Gambit'],
      'Alex Ich': ['mid', 'Gambit'],
      Genja: ['adc', 'Gambit'],
      EDward: ['support', 'Gambit'],
      fredy122: ['top', 'SK Gaming'],
      Svenskeren: ['jungle', 'SK Gaming'],
      Jesiz: ['mid', 'SK Gaming'],
      CandyPanda: ['adc', 'SK Gaming'],
      nRated: ['support', 'SK Gaming'],
      YoungBuck: ['top', 'Copenhagen Wolves'],
      Amazing: ['jungle', 'Copenhagen Wolves'],
      cowTard: ['mid', 'Copenhagen Wolves'],
      Forg1ven: ['adc', 'Copenhagen Wolves'],
      Unlimited: ['support', 'Copenhagen Wolves'],
      Mimer: ['top', 'Supa Hot Crew XD'],
      Impaler: ['jungle', 'Supa Hot Crew XD'],
      Moopz: ['mid', 'Supa Hot Crew XD'],
      'Mr RalleZ': ['adc', 'Supa Hot Crew XD'],
      Migxa: ['support', 'Supa Hot Crew XD']
    };
    topplayers = [];
    midplayers = [];
    jungleplayers = [];
    adcplayers = [];
    supportplayers = [];
    for (key in playerinfo) {
      info = playerinfo[key];
      if (info[0] === 'top') {
        topplayers.push(key);
      } else if (info[0] === 'mid') {
        midplayers.push(key);
      } else if (info[0] === 'jungle') {
        jungleplayers.push(key);
      } else if (info[0] === 'adc') {
        adcplayers.push(key);
      } else if (info[0] === 'support') {
        supportplayers.push(key);
      }
    }
    draftteam = function() {
      var drafted, invalid, _ref, _ref1, _ref2, _ref3, _ref4;
      $('.error.draft').hide();
      drafted = {};
      drafted.top = $('#autocompletetop').val();
      drafted.mid = $('#autocompletemid').val();
      drafted.jungle = $('#autocompletejungle').val();
      drafted.adc = $('#autocompleteadc').val();
      drafted.support = $('#autocompletesupport').val();
      invalid = false;
      if (_ref = drafted.top, __indexOf.call(topplayers, _ref) < 0) {
        $('.error.draft.drafttop').show();
        $('#autocompletetop').val('');
        invalid = true;
      }
      if (_ref1 = drafted.mid, __indexOf.call(midplayers, _ref1) < 0) {
        $('.error.draft.draftmid').show();
        $('#autocompletemid').val('');
        invalid = true;
      }
      if (_ref2 = drafted.jungle, __indexOf.call(jungleplayers, _ref2) < 0) {
        $('.error.draft.draftjungle').show();
        $('#autocompletejungle').val('');
        invalid = true;
      }
      if (_ref3 = drafted.adc, __indexOf.call(adcplayers, _ref3) < 0) {
        $('.error.draft.draftadc').show();
        $('#autocompleteadc').val('');
        invalid = true;
      }
      if (_ref4 = drafted.support, __indexOf.call(supportplayers, _ref4) < 0) {
        $('.error.draft.draftsupport').show();
        $('#autocompletesupport').val('');
        invalid = true;
      }
      if (invalid !== true) {
        return $.ajax({
          data: drafted,
          url: '/draftplayers',
          cache: false,
          type: "POST",
          datatype: 'json',
          success: processSuccessDraft,
          error: function(jqxr, status, error) {
            return console.log(jqxr.responseText);
          }
        });
      }
    };
    processSuccessDraft = function(data) {
      $('#draftteam').hide(50);
      return populateroster(data);
    };
    $('.contactus').click(function(e) {
      e.preventDefault();
      return $('.contactus').html('team@fantasylol.net');
    });
    $('#signupheader').click(function(e) {
      var password, username;
      username = $('#loginusername').val();
      password = $('#loginpassword').val();
      e.preventDefault();
      return $.ajax({
        data: {
          username: username,
          password: password
        },
        url: '/login',
        cache: true,
        type: "POST",
        datatype: 'html',
        success: processRegistration,
        error: function(jqxr, status, error) {
          return $('#loginerror').text('Incorrect username or password.');
        }
      });
    });
    setupauto = function() {
      $('#autocompletetop').autocomplete({
        source: topplayers
      });
      $('#autocompletemid').autocomplete({
        source: midplayers
      });
      $('#autocompletejungle').autocomplete({
        source: jungleplayers
      });
      $('#autocompleteadc').autocomplete({
        source: adcplayers
      });
      return $('#autocompletesupport').autocomplete({
        source: supportplayers
      });
    };
    calcdelta = function(player, score) {
      var delta, final, playerstat, previous, ratio, _i, _len, _ref;
      ratio = player.timesvisited / player.gamesplayed.length;
      if (score === 'gold') {
        final = player['totalgpmscore'] / ratio;
      } else if (score === 'total') {
        final = player['totalscore'] / ratio;
      } else {
        final = player['total' + score + 'score'] / ratio;
      }
      _ref = player.mostrecentgamestat.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        playerstat = _ref[_i];
        if (playerstat['player field'] === player.playername) {
          previous = playerstat['score'][score + 'score'] / ratio;
        }
      }
      delta = (final - previous) / previous;
      return delta;
    };
    populateroster = function(data) {
      var player, ratio, _i, _len;
      if (JSON.stringify(data) === '[]') {
        return $('#draftteam').show(100);
      } else {
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          player = data[_i];
          ratio = player.timesvisited / player.gamesplayed.length;
          console.log('.playername' + player.role);
          console.log(ratio);
          $('.playername' + player.role).text(player.playername);
          $('.pure-u-1-5.' + player.role + ' .kda .score').text(Math.round(player.totalkdascore * 10 / ratio) / 10);
          $('.pure-u-1-5.' + player.role + ' .kda .percent').text(Math.round(calcdelta(player, 'kda')) + '%');
          $('.pure-u-1-5.' + player.role + ' .gold .score').text(Math.round(player.totalgpmscore * 10 / ratio) / 10);
          $('.pure-u-1-5.' + player.role + ' .gold .percent').text(Math.round(calcdelta(player, 'gold')) + '%');
          $('.pure-u-1-5.' + player.role + ' .part .score').text(Math.round(player.totalpartscore * 10 / ratio) / 10);
          $('.pure-u-1-5.' + player.role + ' .part .percent').text(Math.round(calcdelta(player, 'part')) + '%');
          $('.pure-u-1-5.' + player.role + ' .cs .score').text(Math.round(player.totalcsscore * 10 / ratio) / 10);
          $('.pure-u-1-5.' + player.role + ' .cs .percent').text(Math.round(calcdelta(player, 'cs')) + '%');
          $('.pure-u-1-5.' + player.role + ' .total .score').text(Math.round(player.totalscore * 10 / ratio) / 10);
          $('.pure-u-1-5.' + player.role + ' .total .percent').text(Math.round(calcdelta(player, 'total')) + '%');
        }
        return $('#roster').show(100);
      }
    };
    processRegistration = function(data) {
      var animatelogout, fadeindraft;
      $('#loginerror').text('');
      $('#loginusername').fadeOut(50);
      $('#loginpassword').fadeOut(50);
      animatelogout = function() {
        return $('#signupheaderchild').fadeOut(20, function() {
          $(this).html("Logout");
          return $(this).fadeIn(50);
        });
      };
      fadeindraft = function() {
        $('.deck').html(data);
        setupauto();
        $('#draftnow').click(draftteam);
        $('#roster').hide();
        $('#draftteam').hide();
        $('.deck').fadeIn();
        $('#menu').animate({
          'margin-top': '39px'
        });
        return $.ajax({
          url: '/roster',
          cache: false,
          type: "GET",
          datatype: 'json',
          success: populateroster,
          error: function(jqxr, status, error) {
            return console.log(jqxr.responseText);
          }
        });
      };
      $('.deck').fadeOut(200, fadeindraft);
      return $('.pure-menu-horizontal').animate({
        padding: 0
      }, {
        duration: 500,
        easing: 'linear',
        complete: animatelogout
      });
    };
    return validator = $('#signupform').validate({
      debug: true,
      rules: {
        name: {
          required: true,
          minlength: 2,
          maxlength: 50,
          remote: {
            url: "checkusername",
            type: "post",
            data: {
              username: function() {
                return $('#name').val();
              }
            }
          }
        },
        password: {
          required: true,
          minlength: 3,
          maxlength: 50
        },
        email: {
          required: true,
          email: true,
          remote: {
            url: "checkemail",
            type: "post",
            data: {
              email: function() {
                return $('#email').val();
              }
            }
          }
        }
      },
      messages: {
        name: {
          required: "Summoner Name please! :)",
          minlength: $.format("No way your name is shorter than {0} characters!"),
          maxlength: $.format("No way your name is that longer than {0} characters!"),
          remote: $.format("Someone has taken {0}!")
        },
        password: {
          required: "Password please!",
          minlength: $.format("Passwords must be greater than {0} characters"),
          maxlength: $.format("Way too long! Keep it less than {0} characters")
        },
        email: {
          required: "Email please! No spam here :)",
          remote: $.format("{0} is already in use!")
        }
      },
      errorPlacement: function(error, element) {
        return error.insertAfter(element);
      },
      submitHandler: function(form) {
        var register;
        register = {};
        $.each($(form).children('.valid'), function(index, element) {
          return register[$(element).attr('name')] = $(element).val();
        });
        console.log(register);
        return $.ajax({
          data: register,
          url: '/register',
          cache: false,
          type: "POST",
          datatype: 'json',
          success: processRegistration,
          error: function(jqxr, status, error) {
            $('.registrationfail').html('Server error, try again?');
            return console.log(jqxr.responseText);
          }
        });
      }
    });
  });

}).call(this);

(function() {


}).call(this);
