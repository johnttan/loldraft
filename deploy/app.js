(function() {
  var app, data, db, express, mongoose;

  express = require("express");

  mongoose = require('mongoose');

  data = require('models/data');

  mongoose.connect('mongodb://localhost/test');

  db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error'));

  db.once('open', function() {
    data.schemas();
    return data.models();
  });

  app = express();

  app.configure(function() {
    var publicDir, viewsDir;
    publicDir = "" + __dirname + "/public";
    viewsDir = "" + __dirname + "/views";
    app.set("views", viewsDir);
    app.set("view engine", "ejs");
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    return app.use(express["static"](publicDir));
  });

  app.configure("development", function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure("production", function() {
    return app.use(express.errorHandler());
  });

  app.listen(3000);

  console.log("Express server listening on port 3000");

}).call(this);
