var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .post(function(req, res) {
    let user = req.session.user;
    let userid = req.session.userid;
    let hash = req.params.hash;

    if(user === undefined) {
      res.json({success: "no-user"});
      return;
    }

    db.ungrinAt(hash, userid, function(err, results) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        res.json({success: true});
      }
    })
  })
}
