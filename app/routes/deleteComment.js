var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:id')
  .get(function(req,res) {
    let commentID = req.params.id;
    let userid = req.session.userid;

    db.getUser('userid', userid, function(err, getUserResult) {
      if(err) {
        res.status(500).send("Server error");
      }
      //if the user is an admin
      else if(getUserResult[0]) {
        if(getUserResult[0].type === "admin") {
          db.deleteComment(commentID, function(err, deletePostResult) {
            if(err) {
              res.status(500).send("Server error");
            }
            else {
              res.json({success: true});
              return;
            }
          });
        }
        else {
          db.getComment(commentID, function(err, getCommentResult) {
            if(err) {
              res.status(500).send("Server error");
            }
            else {
              //if its their comment
              if(getCommentResult[0].commenter_id === userid) {
                db.deleteComment(commentID, function(err, deletePostResult) {
                  if(err) {
                    res.status(500).send("Server error");
                  }
                  else {
                    res.json({success: true});
                    return;
                  }
                })
              }
              else {
                let postHash = getCommentResult[0].post_hash;
                db.getPost(postHash, function(err, getPostResult) {
                  if(err) {
                    res.status(500).send("Server error");
                  }
                  else {
                    if(getPostResult[0].poster_id === userid) {
                      res.json({success: true});
                      return;
                    }
                    else {
                      res.json({error_reason: 'no-privilege'});
                    }
                  }
                })
              }
            }
          })
        }
      }
      else {
        res.json({error_reason: 'no-user'})
      }
    })
  })
}
