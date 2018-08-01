var express = require('express');
var routes = require('require-dir')();
const session = require('express-session');

function changeCase(str) {
  newStr = str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
  return newStr;
}

module.exports = function(app) {
  'use strict';
  app.use(session({
    credentials: 'include',
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      maxAge: null
    }
  }));
  Object.keys(routes).forEach(function(routeName) {
    var router = express.Router();
    require('./' + routeName)(router);

    app.use('/' + changeCase(routeName), router);
  });
}
