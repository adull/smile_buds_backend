var server = require('./app/config/initializers/server.js');
var database = require('./app/config/initializers/database.js')
var async = require('async');
require('dotenv').config();


async.series([
  // function initializeDBConnection(callback) {
  //   database(callback);
  // },
  function startServer(callback) {
    server(callback);
  }], function(err) {
    if(err) {
      console.log('[APP] initialization failed', err);
    } else {
      // console.log('[APP] initialized SUCCESSFULLY');
    }
  })
