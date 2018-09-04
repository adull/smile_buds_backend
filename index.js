// var server = require('./app/config/initializers/server.js');
// var database = require('./app/config/initializers/database.js')
// var async = require('async');
// require('dotenv').config();
//
// // const cluster = require('cluster');
// // const numCPUs = require('os').cpus().length;
//
//
// // if (cluster.isMaster) {
// //   for (var i = 0; i < numCPUs; i++) {
// //     cluster.fork();
// //   }
// //
// //   cluster.on('exit', (worker, code, signal) => {
// //     console.log(`worker ${worker.process.pid} died`);
// //   });
// // }
// // else {
//   // console.log("started")
//   module.exports = start;
//   async.series([
//     // function initializeDBConnection(callback) {
//     //   database(callback);
//     // },
//     function startServer(callback) {
//       server(callback);
//     }], function(err) {
//       if(err) {
//         console.log('[APP] initialization failed', err);
//       } else {
//         // console.log('[APP] initialized SUCCESSFULLY');
//       }
//     })
//
// // }

var server = require('./app/config/initializers/server.js');
var database = require('./app/config/initializers/database.js')
var async = require('async');
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
