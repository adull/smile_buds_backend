var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:id')
  .post(function(req, res) {
    let userID = req.session.userid;
    let userIdentifier = req.session.identifier;
    let commentID = req.params.id;

    if(userIdentifier === undefined) {
      res.json({fail: "no-user"});
      return;
    }
    else if(commentID) {
      db.ungrinAtComment(commentID, userIdentifier, function(err, grinAtCommentResult) {
        if(err) {
          console.log(err)
          res.status(500).send("Server error");
        }
        else {
          db.getComment(commentID, function(err, getCommentResult) {
            if(err) {
              console.log(err)
              res.status(500).send("Server error");
            }
            else {
              let commenterID = getCommentResult[0].commenter_id;
              db.deleteLove(userID, commenterID, function(err, deleteLoveResult) {
                if(err) {
                  console.log(err)
                  res.status(500).send("Server error");
                }
                else {
                  res.json({success: true});
                }
              })
            }
            // res.end();
          })
        }
      })
    }
    else {
      // no comment id - weird potential edge case error
      res.end();
    }
  })
}
