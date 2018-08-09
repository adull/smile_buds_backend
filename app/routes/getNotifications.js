var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    let user = req.session.user;
    let userid = req.session.userid;

    if(user === undefined || userid === undefined) {
      console.log("stop here - no user/userid");
      res.json({success: "no-user"});
      return;
    }
    else {
      db.getPostNotifications(userid, function(err, postNotifications) {
        if(err) {
          res.status(500).send("Server error");
        }
        else {
          // let postNotificationsArr = postNotifications;
          db.getMessageNotifications(userid, function(err, messageNotifications) {
            if(err) {
              res.status(500).send("Server error");
            }
            else {
              let allNotifications = postNotifications.concat(messageNotifications);
              res.json(allNotifications);
            }
          })
        }
      })
    }
  })
}
