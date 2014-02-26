
$ ->
    playerinfo = {
        Cruzerthebruzer: ['top', 'Dignitas']
        Crumbzz: ['jungle', 'Dignitas']
        Scarra: ['mid', 'Dignitas']
        Imaqtpie: ['adc', 'Dignitas']
        KiWiKiD: ['support', 'Dignitas']
        Balls: ['top', 'Cloud 9']
        Meteos: ['jungle', 'Cloud 9']
        Hai: ['mid', 'Cloud 9']
        Sneaky: ['adc', 'Cloud 9']
        LemonNation: ['support', 'Cloud 9']
        Dyrus: ['top', 'TSM']
        TheOddOne: ['jungle', 'TSM']
        Bjergsen: ['mid', 'TSM']
        WildTurtle: ['adc', 'TSM']
        Xpecial: ['support', 'TSM']
        Nien: ['top', 'CLG']
        Link: ['jungle', 'CLG']
        HotshotGG: ['mid', 'CLG']
        Doublelift: ['adc', 'CLG']
        Aphromoo: ['support', 'CLG']
        Innox: ['top', 'Evil Geniuses']
        Snoopeh: ['jungle', 'Evil Geniuses']
        Pobelter: ['mid', 'Evil Geniuses']
        Yellowpete: ['adc', 'Evil Geniuses']
        Krepo: ['support', 'Evil Geniuses']
        Benny: ['top', 'XDG']
        Zuna: ['jungle', 'XDG']
        mancloud: ['mid', 'XDG']
        Xmithie: ['adc', 'XDG']
        BloodWater: ['support', 'XDG']
        ZionSpartan: ['top', 'Coast']
        NintendudeX: ['jungle', 'Coast']
        Shiphtur: ['mid', 'Coast']
        WizFujiiN: ['adc', 'Coast']
        Daydreamin: ['support', 'Coast']
        Quas: ['top', 'Curse']
        IWillDominate: ['jungle', 'Curse']
        Voyboy: ['mid', 'Curse']
        Cop: ['adc', 'Curse']
        Zekent: ['support', 'Curse']
        Wickd: ['top', 'Alliance']
        Shook: ['jungle', 'Alliance']
        Froggen: ['mid', 'Alliance']
        Tabzz: ['adc', 'Alliance']
        Nyph: ['support', 'Alliance']
        sOAZ: ['top', 'Fnatic']
        Cyanide: ['jungle', 'Fnatic']
        xPeke: ['mid', 'Fnatic']
        Rekkles: ['adc', 'Fnatic']
        YellOwStaR: ['support', 'Fnatic']
        Kev1n: ['top', 'Millenium']
        Araneae: ['jungle', 'Millenium']
        Kerp: ['mid', 'Millenium']
        Creaton: ['adc', 'Millenium']
        Jree: ['support', 'Millenium']
        Xaxus: ['top', 'ROCCAT']
        Jankos: ['jungle', 'ROCCAT']
        Overpow: ['mid', 'ROCCAT']
        Celaver: ['adc', 'ROCCAT']
        VandeR: ['support', 'ROCCAT']
        Darien: ['top', 'Gambit']
        Diamond: ['jungle', 'Gambit']
        'Alex Ich': ['mid', 'Gambit']
        Genja: ['adc', 'Gambit']
        EDward: ['support', 'Gambit']
        fredy122: ['top', 'SK Gaming']
        Svenskeren: ['jungle', 'SK Gaming']
        Jesiz: ['mid', 'SK Gaming']
        CandyPanda: ['adc', 'SK Gaming']
        nRated: ['support', 'SK Gaming']
        YoungBuck: ['top', 'Copenhagen Wolves']
        Amazing: ['jungle', 'Copenhagen Wolves']
        cowTard: ['mid', 'Copenhagen Wolves']
        Forg1ven: ['adc', 'Copenhagen Wolves']
        Unlimited: ['support', 'Copenhagen Wolves']
        Mimer: ['top', 'Supa Hot Crew XD']
        Impaler: ['jungle', 'Supa Hot Crew XD']
        Moopz: ['mid', 'Supa Hot Crew XD']
        'Mr RalleZ': ['adc', 'Supa Hot Crew XD']
        Migxa: ['support', 'Supa Hot Crew XD']
        dexter: ['jungle', 'CLG'],
        Nickwu: ['jungle', 'XDG'],
        Zorozero: ['top', 'Gambit'],
        Nukeduck: ['mid', 'Gambit'],
        Hulberto: ['jungle', 'Gambit'],
        fury: ['adc', 'Gambit']
    }
    topplayers = []
    midplayers = []
    jungleplayers = []
    adcplayers = []
    supportplayers = []
    for key, info of playerinfo
        if info[0] == 'top'
            topplayers.push(key)
        else if info[0] == 'mid'
            midplayers.push(key)
        else if info[0] == 'jungle'
            jungleplayers.push(key)
        else if info[0] == 'adc'
            adcplayers.push(key)
        else if info[0] == 'support'
            supportplayers.push(key)

    draftteam = ()->
        $('.error.draft').hide()
        drafted = {}
        drafted.top = $('#autocompletetop').val()
        drafted.mid = $('#autocompletemid').val()
        drafted.jungle = $('#autocompletejungle').val()
        drafted.adc = $('#autocompleteadc').val()
        drafted.support = $('#autocompletesupport').val()
        invalid = false
        if drafted.top not in topplayers
            $('.error.draft.drafttop').show()
            $('#autocompletetop').val('')
            invalid = true
        if drafted.mid not in midplayers
            $('.error.draft.draftmid').show()
            $('#autocompletemid').val('')
            invalid = true
        if drafted.jungle not in jungleplayers
            $('.error.draft.draftjungle').show()
            $('#autocompletejungle').val('')
            invalid = true
        if drafted.adc not in adcplayers
            $('.error.draft.draftadc').show()
            $('#autocompleteadc').val('')
            invalid = true
        if drafted.support not in supportplayers
            $('.error.draft.draftsupport').show()
            $('#autocompletesupport').val('')
            invalid = true
        if invalid != true
            $.ajax(
                data: drafted
                url: '/draftplayers'
                cache: false
                type: "POST"
                datatype: 'json'
                success: processSuccessDraft
                error: (jqxr, status, error)->
                    
                    console.log(jqxr.responseText)
            
                )

    processSuccessDraft = (data)->
        $('#draftteam').hide(50)
        populateroster(data)

    
        

    $('.contactus').click(
        (e)->
            e.preventDefault()
            $('.contactus').html('team@leaguedrafted.com')
        )
    $('#loginpassword').keypress((e)->
        if e.which == 13
            username = $('#loginusername').val()
            password = $('#loginpassword').val()
            e.preventDefault()
            $.ajax(
                data: {username: username, password: password}
                url: '/login'
                cache: true
                type: "POST"
                datatype: 'html'
                success: processRegistration
                error: (jqxr, status, error)->
                    $('#loginerror').text('Incorrect username or password.')
            
            )
        )
    $('#loginusername').keypress((e)->
        if e.which == 13
            username = $('#loginusername').val()
            password = $('#loginpassword').val()
            e.preventDefault()
            $.ajax(
                data: {username: username, password: password}
                url: '/login'
                cache: true
                type: "POST"
                datatype: 'html'
                success: processRegistration
                error: (jqxr, status, error)->
                    $('#loginerror').text('Incorrect username or password.')
            
            )
        )
    $('#loginusername').keypress((e)->
        if e.which == 13
            username = $('#loginusername').val()
            password = $('#loginpassword').val()
            e.preventDefault()
            $.ajax(
                data: {username: username, password: password}
                url: '/login'
                cache: true
                type: "POST"
                datatype: 'html'
                success: processRegistration
                error: (jqxr, status, error)->
                    $('#loginerror').text('Incorrect username or password.')
            
            )
        )
    $('#signupheader').click(
        (e)->
            username = $('#loginusername').val()
            password = $('#loginpassword').val()
            e.preventDefault()
            $.ajax(
                data: {username: username, password: password}
                url: '/login'
                cache: true
                type: "POST"
                datatype: 'html'
                success: processRegistration
                error: (jqxr, status, error)->
                    $('#loginerror').text('Incorrect username or password.')
            
            ))

    setupauto = ()->
        $('#autocompletetop').autocomplete({
            source: topplayers

            })
        $('#autocompletemid').autocomplete({
            source: midplayers

            })
        $('#autocompletejungle').autocomplete({
            source: jungleplayers

            })
        $('#autocompleteadc').autocomplete({
            source: adcplayers

            })
        $('#autocompletesupport').autocomplete({
            source: supportplayers

            })


    calcdelta = (player, score)->
        if score == 'gold'
            final = player.scores['goldscore']
        else if score == 'total'
            final = player.scores['totalscore']
        else
            final = player.scores[score + 'score']

        for playername, playerstat of player.latestgame.players
            if playerstat['playername'] == player.playername
                previous = playerstat['score'][score + 'score']
        if previous == 0
            return 0

        console.log(final + ' ' + previous)
        delta = (final - previous) / previous
        return delta



    populateroster = (data) ->
        console.log(data)
        if JSON.stringify(data) == '{}' or data == 'undefined'
            $('#draftteam').show(100)

        else
            for role, player of data
                $('.playername' + role).text(player.playername)
                $('.pure-u-1-5.' + role + ' .kda .score').text((Math.round(player.scores.kdascore *10) / 10))
                $('.pure-u-1-5.' + role + ' .kda .percent').text(Math.round(calcdelta(player, 'kda')) + '%')
                $('.pure-u-1-5.' + role + ' .gold .score').text(Math.round(player.scores.goldscore *10) / 10)
                $('.pure-u-1-5.' + role + ' .gold .percent').text(Math.round(calcdelta(player, 'gold')) + '%')
                $('.pure-u-1-5.' + role + ' .part .score').text(Math.round(player.scores.partscore *10) / 10)
                $('.pure-u-1-5.' + role + ' .part .percent').text(Math.round(calcdelta(player, 'part')) + '%')
                $('.pure-u-1-5.' + role + ' .cs .score').text(Math.round(player.scores.csscore *10) / 10)
                $('.pure-u-1-5.' + role + ' .cs .percent').text(Math.round(calcdelta(player, 'cs')) + '%')
                $('.pure-u-1-5.' + role + ' .total .score').text(Math.round(player.scores.totalscore *10) / 10)
                $('.pure-u-1-5.' + role + ' .total .percent').text(Math.round(calcdelta(player, 'total')) + '%')

            $('#roster').show(100)
            $('#rosterclick').on('click', ()->
                    $('.rostermenu').addClass('menu-item-divided pure-menu-selected')
                    $('.rankmenu').removeClass('menu-item-divided pure-menu-selected')
                    $('#ranking').hide()
                    $('#roster').show(100)
                    )
    processRanking = (ranks)->
        $('.rankspin').hide()
        $('#rankingcontainer').html(ranks)

    
    processRegistration = (data) ->
        $('#loginerror').text('')
        $('#loginusername').fadeOut(50)
        $('#loginpassword').fadeOut(50)
        animatelogout = ()-> 
            $('#signupheaderchild').fadeOut(20, ()->
                $(this).html("Logout")
                $(this).fadeIn(50)
                $(this).on('click', ()->
                                        console.log('clicked logout')
                                        $.ajax(
                                            url: '/logout'
                                            cache: false
                                            type: "GET"
                                            datatype: 'html'
                                            success: (data)->
                                                document.write(data)
                                            error: (jqxr, status, error)->
                                                console.log("couldn't log out")
                                        )
                    )
                )
        fadeindraft = ()->
            $('.deck').html(data)
            setupauto()
            $('#draftnow').click(draftteam)
            $('#roster').hide()
            $('#ranking').hide()
            $('#draftteam').hide()
            $('.deck').fadeIn()
            $('#rankclick').on('click', ()->
                    console.log('rank?')
                    $('.rostermenu').removeClass('menu-item-divided pure-menu-selected')
                    $('.rankmenu').addClass('menu-item-divided pure-menu-selected')
                    $('#roster').hide()
                    $('#ranking').show()
                    $('.rankspin').show(100)
                    $.ajax(
                        url: '/rankings'
                        cache: false
                        type: "GET"
                        success: processRanking
                        error: (jqxr, status, error)->
                            $('#ranking').text('Server Error')
                            $('#ranking').show()
                    
                    ))
            $('#menu').animate({'margin-top':'39px'})
            $.ajax(
                url: '/roster'
                cache: false
                type: "GET"
                datatype: 'json'
                success: populateroster
                error: (jqxr, status, error)->
                    console.log(jqxr.responseText)
                    $('#draftteam').show(100)
            )
        $('.deck').fadeOut(200, fadeindraft)
        $('.pure-menu-horizontal').animate({
            padding: 0
            },
            {
                duration: 500
                easing: 'linear'
                complete: animatelogout
            }
            )
    $.ajax(
                url: '/autologin'
                cache: false
                type: "GET"
                datatype: 'html'
                success: processRegistration
                error: (jqxr, status, error)->
                    console.log('not logged in')
                    )


    validator = $('#signupform').validate({
        debug: true
        rules:{
            name: {
                required: true
                minlength: 2
                maxlength: 15
                remote: {
                    url: "checkusername"
                    type: "post"
                    data: {
                        username: ()->
                            return $('#name').val()
                            
                    }
                }

            },

            password: {
                required: true
                minlength: 3
                maxlength: 50
            },

            email: {
                required: true
                email: true
                remote: {
                    url: "checkemail"
                    type: "post"
                    data: {
                        email: ()->
                            return $('#email').val()
                    }
                }
            }

        },
        messages: {
            name: {
                required: "Summoner Name please! :)"
                minlength: $.format("No way your name is shorter than {0} characters!")
                maxlength: $.format("No way your name is longer than {0} characters!")
                remote: $.format("Someone has taken {0}!")
            },
            password: {
                required: "Password please!"
                minlength: $.format("Passwords must be greater than {0} characters")
                maxlength: $.format("Way too long! Keep it less than {0} characters")
            },
            email: {
                required: "Email please! No spam here :)"
                remote: $.format("{0} is already in use!")
                
            }
        },
        errorPlacement: (error, element)->
                    error.insertAfter(element)
        ,
        submitHandler: (form)->
            register = {}
            $.each($(form).children('.valid'), (index, element)->
                register[$(element).attr('name')] = $(element).val()
                )
            console.log(register)

            $.ajax({
                data: register
                url: '/register'
                cache: false
                type: "POST"
                datatype: 'json'
                success: processRegistration
                error: (jqxr, status, error)->
                    $('.registrationfail').html('Server error, try again?')
                    console.log(jqxr.responseText)



            })

        })

    