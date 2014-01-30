mongoose = require 'mongoose'
passport = require 'passport'
models = require('./models/data').models
sendgames = require('./models/sendgames')
validator = require 'validator'
mongoose.connect('mongodb://localhost/test')

models.User.findOne({'username': req.body.username}, (err, doc)->
    if err
        console.log err
    else
        console.log doc
        )