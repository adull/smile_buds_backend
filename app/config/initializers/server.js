const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const port = 9001;

var start = function(cb) {
  'use strict';

  const app = express();

  app.set('trust proxy', 1);

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
