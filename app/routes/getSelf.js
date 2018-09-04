var db = require('../config/initializers/database');

// quickly get user based on cookie
module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    var userid = req.session.userid;
    db.getUser('userid', userid, function(err, results) {
      if(err) {
        console.log(err);
        res.status(500).send("Server error");
        return;
      }
      else {
        if(results[0]) {
          res.json(results[0]);
          return;
        }
        else {
          res.json({"signedIn": false})
          return;
        }
      }
    })
  })
}
