express = require "express"
mongoose = require 'mongoose'
data = require('./models/data').models
passport = require 'passport'

mongoose.connect('mongodb://localhost/test')

db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))

db.once('open', () ->



app = express()

app.configure ->
  publicDir = "#{__dirname}/public"
  viewsDir =  "#{__dirname}/views"
  app.set "views", viewsDir
  app.set "view engine", "jade"
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use passport.initialize();
  app.use passport.session();
  app.use app.router
  app.use express.static(publicDir)


app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()

passport.use(data.User.createStrategy())
passport.serializeUser(data.User.serializeUser())
passport.deserializeUser(data.User.deserializeUser())

require('./routes')(app)

app.listen 3000
console.log "Express server listening on port 3000"

)