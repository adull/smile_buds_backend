var express = require('express');
var routes = require('require-dir')();
var cookieSession = require('cookie-session');


function changeCase(str) {
  newStr = str.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`);
  return newStr;
}

module.exports = function(app) {
  'use strict';
  app.use(cookieSession({
    credentials: 'include',
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: null
    }
  }));
  Object.keys(routes).forEach(function(routeName) {
    var router = express.Router();
    require('./' + routeName)(router);

    if(process.env.NODE_ENV === 'development') {
      app.use('/api/' + changeCase(routeName), router);
    }
    else if(process.env.NODE_ENV === 'production') {
      app.use('/' + changeCase(routeName), router);
    }

  });
}
