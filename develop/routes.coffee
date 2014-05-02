passport = require 'passport'
models = require('./models/data').models
validator = require 'validator'
ensureLogin = require('connect-ensure-login').ensureLoggedIn


module.exports = (app)->
    app.get('/', (req, res)->
        res.render('index.jade')

        )

    app.post('/register', (req, res)-> 

        try
            console.log(req.body.username)
            models.User.register(
                new models.User({username: req.body.name, email: req.body.email}),
                req.body.password,
                (err, account)->
                    if(err)
                        if err.message == 'User already exists with name ' + req.body.username
                            res.send(404, err)
                            
                        else
                            console.log(err)
                            res.send(404, err)
                    else
                        console.log('registered, logging in ' + account)
                        req.login(account, (err)->
                                res.render('draft.jade', {name: account.username})
                        )
                            
            )
    
        catch error
            res.send(404, error)
    )

    app.get('/logout', (req, res)->
            req.session.destroy((err)->
                req.logout()
                res.redirect('/')
                )

            )
    app.post('/login', passport.authenticate('local'),
        (req, res)->
            res.render('draft.jade', {name: req.user.username})
        )

    app.get('/autologin',
        (req, res)->
            req.login(req.user, (err)->
                if err
                    res.send(404, 'not logged in')
                else
                    res.render('draft.jade', {name: req.user.username})
            ))


    app.post('/checkusername', (req, res)->
        models.User.findOne({'username': req.body.username}, (err, doc)->
            if err
                console.log(err)
                res.send(err)
            else if doc
                res.send('null')
            else
                res.send(true)
            )


        )

    app.post('/checkemail', (req, res)->
        if validator.isEmail(req.body.email) != true
            res.send('Email is not of valid form!')
        models.User.findOne({'email': req.body.email}, (err, doc)->
            if err
                console.log(err)
                res.send(err)
            else if doc
                res.send('null')
            else
                res.send(true)
            )


        )

    app.get('/roster',
        ensureLogin('/'),
        (req, res)->
            models.User.findOne({'username': req.user.username}, (err,user)->
                if err
                    return console.log(err)
                if user.roster == undefined
                    return res.send(404, 'no roster')
                else
                    user.populate('roster.top roster.mid roster.jungle roster.adc roster.support', (err, user)->
                                                    return res.json(user.roster)
                                                )
            ))
    app.get('/rosterjsontest',
        (req, res)->
            models.User.findOne({'username': 'ostonzi'}, (err,user)->
                if err
                    return console.log(err)
                if user.roster == undefined
                    return res.send(404, 'no roster')
                else
                    user.populate('roster.top roster.mid roster.jungle roster.adc roster.support', (err, user)->
                                                    return res.json(user.roster)
                                                )
            ))
    app.post('/draftplayers',
        ensureLogin('/'),
        (req, res)->

            models.User.findOne({'username': req.user.username}, (err,user)->
                if err
                    return console.log(err)
                rosterarray = []
                for role, play of req.body
                    rosterarray.push(play)
                models.Player.aggregate({
                    $match: {playername:{$in: rosterarray}}
                    }).exec((err, result)->
                        for player in result
                            console.log(player)
                            if user.roster == undefined
                                user.roster = {}
                            user.roster[player['role']] = player['_id']
                            user.rosterarray = rosterarray
                        user.save((err, result)->
                            res.redirect('/roster')
                            )
                        )

                # for role, play of req.body
                #     models.Player.findOne({'playername': play}, (err, player)->
                #         if err
                #             return console.log(err)
                #         user.roster.push (player['_id'])
                #         player.owner = user
                #         user.rosterarray.push(player.playername)
                #         user.save()
                #                 )
                                    
                            
                    
                ))
    
    app.get('/rankings',
        ensureLogin('/'),
        (req, res)->
            models.Player.aggregate(
                {$match: {}},
                {$sort: {'scores.totalscore': -1}},
                {$project: {
                    playername: 1
                    teamname: 1
                    'scores.totalscore': 1
                    gamesplayed: 1
                    role: 1
                        }}

                ).exec((err, result)->
                    models.User.findOne({'username': req.user.username}, (err, user)->
                        if err
                            return console.log(err)
                        console.log(user.rosterarray)
                        console.log(typeof(user.rosterarray[0]))
                        console.log(typeof(result[0].playername))
                        models.User.aggregate(
                                {$match: {}},
                                {$sort: {totaluserscore: -1}}
                                {$project: {
                                    username: 1
                                    rosterarray: 1
                                    totaluserscore: 1
                                    }}

                            ).exec((err, userlist)->
                                    ownedplayers = []
                                    for user1 in userlist
                                        ownedplayers += user1.rosterarray
                                    res.render('ranking', {items: result, yourname: user.username, rosterarray: user.rosterarray, userlist: userlist, ownedplayers: ownedplayers, mytotalscore: user.totaluserscore})
                                )
                        
                        )
                        

                    )
        )
        
