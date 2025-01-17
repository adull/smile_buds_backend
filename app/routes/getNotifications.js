var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    let user = req.session.user;
    let userid = req.session.userid;

    if(user === undefined || userid === undefined || userid === '') {
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
              let postMessageNotifications = postNotifications.concat(messageNotifications);
              db.getCommentNotifications(userid, function(err, commentNotifications) {
                if(err) {
                  res.status(500).send("Server error");
                }
                else {
                  let commentPostMessageNotifications = postMessageNotifications.concat(commentNotifications);
                  res.json(commentPostMessageNotifications);
                }
              })
            }
          })
        }
      })
    }
  })
}
