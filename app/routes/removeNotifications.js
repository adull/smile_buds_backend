var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    let userid = req.session.userid;

    db.removeMessageNotifications(userid, function(err, result) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {

        db.removePostNotifications(userid, function(err, result) {
          if(err) {
            res.status(500).send("Server error");
          }
          else {
            res.json(result);
          }
        })
      }
    })
  })
}
