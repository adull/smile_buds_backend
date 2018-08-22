var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {
    let userid = req.session.userid;
    let hash = req.params.hash;
    if(userid) {
      db.removePostNotification(userid, hash, function(err, result) {
        if(err) {
          res.status(500).send("Server error");
        }
        else {
          console.log(result);
          res.json(result);
        }
      })
    }
    else {
      console.log("user logged out before they could click on da shit");
      res.end();
    }
  })
}
