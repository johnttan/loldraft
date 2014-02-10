express = require "express"
mongoose = require 'mongoose'
data = require('./models/data').models
passport = require 'passport'
LocalStrategy = require('passport-local').Strategy
ensureLogin = require('connect-ensure-login').ensureLoggedIn

mongoose.connect('***REMOVED***')
#mongoose.connect('mongodb://localhost/test')

db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))

db.once('open', () ->



app = express()

app.configure ->
  publicDir = "#{__dirname}/public"
  viewsDir =  "#{__dirname}/views"
  app.set "views", viewsDir
  app.set "view engine", "jade"
  app.use express.cookieParser()
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.session(
    {
      secret: '***REMOVED***',
      cookie: {maxAge: 20000000}

    }
    )
  app.use passport.initialize();
  app.use passport.session();
  app.use app.router
  app.use express.static(publicDir)

passport.use(new LocalStrategy(data.User.authenticate()))

passport.serializeUser(data.User.serializeUser())
passport.deserializeUser(data.User.deserializeUser())


app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()



require('./routes')(app)

app.listen 8080
console.log "Express server listening on port 3000"

)