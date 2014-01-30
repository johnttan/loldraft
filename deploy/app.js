(function() {
  var LocalStrategy, app, data, db, ensureLogin, express, mongoose, passport;

  express = require("express");

  mongoose = require('mongoose');

  data = require('./models/data').models;

  passport = require('passport');

  LocalStrategy = require('passport-local').Strategy;

  ensureLogin = require('connect-ensure-login').ensureLoggedIn;

  mongoose.connect('mongodb://localhost/test');

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error'));

  db.once('open', function() {}, app = express(), app.configure(function() {
    var publicDir, viewsDir;
    publicDir = "" + __dirname + "/public";
    viewsDir = "" + __dirname + "/views";
    app.set("views", viewsDir);
    app.set("view engine", "jade");
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({
      secret: '***REMOVED***'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    return app.use(express["static"](publicDir));
  }), passport.use(new LocalStrategy(data.User.authenticate())), passport.serializeUser(data.User.serializeUser()), passport.deserializeUser(data.User.deserializeUser()), app.configure("development", function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  }), app.configure("production", function() {
    return app.use(express.errorHandler());
  }), require('./routes')(app), app.listen(3000), console.log("Express server listening on port 3000"));

}).call(this);
