passport = require 'passport'
models = require('./models/data').models
sendgames = require('./models/sendgames')
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
            req.logout()
            res.redirect('/')
            )
    app.post('/login', passport.authenticate('local', {session: true}),
        (req, res)->
            res.render('draft.jade', {name: req.user.username})
        )

    app.get('/autologin', passport.authenticate('local', {session: true}),
        (req, res)->
                res.render('draft.jade', {name: req.user.username})

        )

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
                user.populate('roster', (err, user)->
                                            res.json(user.roster)
                                            )
            ))

    app.post('/draftplayers',
        ensureLogin('/'),
        (req, res)->

            models.User.findOne({'username': req.user.username}, (err,user)->
                if err
                    return console.log(err)
                user.roster = []
                user.rosterarray = []
                for role, play of req.body
                    models.Player.findOne({'playername': play}, (err, player)->
                        if err
                            return console.log(err)
                        if user.roster.length < 5
                            user.roster.push (player)
                            player.owner = user
                        if user.rosterarray.length < 5
                            user.rosterarray.push(player.playername)
                        user.save((err, user)->
                            player.save((err, player)->
                                if user.rosterarray.length == 5
                                        user.populate('roster', (err, user)->
                                                console.log(user.roster)
                                                return res.json(user.roster)
                                                
                                            
                                            )
                                )
                                    
                            )
                        )
                    ))

        
