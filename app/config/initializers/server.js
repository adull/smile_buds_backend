const express = require('express');
var compression = require('compression')
const path = require('path');
const bodyParser = require('body-parser');
var device = require('express-device');


const port = 9001;

var start = function(cb) {
  'use strict';

  const app = express();

  app.set('trust proxy', 1);
  app.use(device.capture());

  if(process.env.NODE_ENV === 'development') {
    console.log("development mode")
    var mysqlOptions = {
      user: 'root',
      password: 'root',
      host: 'localhost',
      port: '8889',
      database: 'smile_buds',
      createDatabaseTable: true,
      connectionLimit: 10000
    };
  }
  else if(process.env.NODE_ENV === 'production') {
    console.log("production mode")
    var mysqlOptions = {
      user: 'root',
      password: 'root',
      host: 'localhost',
      port: '3306',
      database: 'smile_buds',
      createDatabaseTable: true,
      connectionLimit: 10000
    };
  }
  else {
    console.log("you fucked up")
  }

  app.use(compression());
  app.use(bodyParser.urlencoded({extended: true}));
  // app.use(bodyParser.json({type: '*/*'}));
  // app.use(bodyParser.json({type: 'application/json'}));
  app.use(bodyParser.json());
  app.use(bodyParser.json({extended: true}));

  require('../../routes/index')(app);

  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    res.json({
      message: err.message,
      error: (app.get('env') === 'development' ? err: {})
    });
    next(err);
  })

  app.listen(port, function(err) {
    if(err) {
      return console.log("cant send to port: " + err);
    }
    else {
      console.log("server is listening on port no. " + port);
    }
  })
  if(cb) {
    return cb();
  }
}

module.exports = start;
