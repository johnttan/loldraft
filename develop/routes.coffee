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


    app.post('/login', passport.authenticate('local', {session: true}),
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
            models.User.findOne({'username': req.user.username}, (err,doc)->
                res.json(doc.roster)

            ))