var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .post(function(req, res) {
    let user = req.session.user;
    let userid = req.session.userid;
    let hash = req.params.hash;

    if(user === undefined || userid === undefined) {
      console.log("stop here");
      res.json({success: "no-user"});
      return;
    }

    // db.getGrinners(hash, function(err, results) {
    //   if(err) {
    //     res.status(500).send("Server error");
    //   }
    //   else {
        db.grinAt(hash, userid, user, function(err, results) {
          if(err) {
            res.status(500).send("Server error");
          }
          else {
            res.json({success: true});
          }
        })
      })
    }
