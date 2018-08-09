var db = require('../config/initializers/database');
var session = require('express-session');

// quickly get user based on cookie
module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    var userid = req.session.userid;
    db.getUser('userid', userid, function(err, results) {
      if(err) {
        console.log(err);
        res.status(500).send("Server error");
      }
      else {
        if(results[0]) {
          res.json(results[0]);
        }
        else {
          res.json({"signedIn": false})
        }
      }
    })
  })
}
