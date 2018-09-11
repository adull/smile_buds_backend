var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .post(function(req, res, next) {
    let hash = req.params.hash
    let commenterID = req.session.userid;
    let commenterName = req.session.user;
    let commenterIdentifier = req.session.identifier;
    let comment = {
      post_hash: hash,
      commenter_id: commenterID,
      commenter_name: commenterName,
      commenter_identifier: commenterIdentifier,
      comment: req.body.comment
    }
    if(commenterID === undefined || commenterName === undefined || commenterIdentifier === undefined) {
      res.json({
        reason: "not-logged-in"
      })
      return;
    }
    db.writeComment(comment, function(err, result) {
      if(err) {
        res.status(500).send("Server error")
      }
      else {
        let usersInvolved = new Set();
        db.getPoster(hash, function(err, result) {
          if(err) {
            res.status(500).send("Server error")
          }
          else {
            // console.log(result[0])
            if(result[0].poster_id) {
              usersInvolved.add(result[0].poster_id);
              db.getCommenters(hash, function(err, results) {
                if(err) {
                  res.status(500).send("Server error")
                }
                else {
                  for(var i = 0; i < results.length; i ++) {
                    usersInvolved.add(results[i].commenter_id)
                  }
                  let commentNotifications = [];
                  for(let notifForID of usersInvolved) {
                    // console.log(commenterID)
                    let commentNotification = {
                      notification_type: 'comment',
                      notification_for: notifForID,
                      notification_from_id: commenterID,
                      notification_from_name: commenterName,
                      post_hash: hash
                    }
                    // console.log(commentNotification);
                    commentNotifications.push(commentNotification)
                  }
                  db.commentNotifications(commentNotifications, function(err, result) {
                    if(err) {
                      res.status(500).send("Server error")
                    }
                    else {
                      res.json({success: true});
                      return;
                    }
                  })
                }
              })
            }
            else {
              res.end();
            }
          }
        })
      }
    })
  })
}
