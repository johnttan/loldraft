'use strict';

var api = require('./controllers/api'),
    index = require('./controllers');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes


  app.get('/api/players', api.players);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/*', middleware.setUserCookie, index.index);
};