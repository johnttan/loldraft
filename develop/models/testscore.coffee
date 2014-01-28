models = require('./data').models
scoreupdate = require('./scoreupdate')
mongoose = require 'mongoose'
mongoose.connect('mongodb://localhost/test')


models.Game.findOne({gameid:'na1876'}, (err, doc)->
        doc.updatescore()


    )