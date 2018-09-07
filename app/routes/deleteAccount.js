var db = require('../config/initializers/database');
// var async = require('async');

module.exports = function(router) {
  router.route('/:identifier')
  .get(function(req, res) {
    let deleteIdentifier = req.params.identifier;
    let userid = req.session.userid;
    db.getUser('userid', userid, function(err, getUserResult) {

      if(err) {
        res.status(500).send("Server error");
      }
      else if(getUserResult[0]) {
        if(getUserResult[0].type === "admin") {
          db.getUser('identifier', deleteIdentifier, function(err, getUserDeleteResult) {
            if(err) {
              res.status(500).send("Server error");
              return;
            }
            else if(getUserDeleteResult[0]) {
              let deleteID = getUserDeleteResult[0].id;
              db.deleteUser(deleteIdentifier, function(err, deleteUserResult) {
                if(err) {
                  console.log("error in delete user")
                  res.status(500).send("Server error");
                }
                else {
                  db.deleteUserComments(deleteIdentifier, function(err, deleteUserCommentsResult) {
                    if(err) {
                      console.log("error in delete comments")
                      res.status(500).send("Server error");
                    }
                    else {
                      db.deleteUserPosts(deleteID, function(err, deleteUserPostsResult) {
                        if(err) {
                          console.log("error in delete user posts")
                          res.status(500).send("Server error");
                        }
                        else {
                          db.deleteUserMessages(deleteID, function(err, deleteUserMessagesResult) {
                            if(err) {
                              console.log("error in delete user messages")
                              res.status(500).send("Server error");
                            }
                            else {
                              res.json({success: true});
                              return;
                            }
                          })
                        }
                      })
                    }
                  })
                }
              });
            }
            else {
              res.end();
              return;
            }
          });
        }
        else {
          res.end();
          return;
        }
      }
      else {
        res.end();
        return;
      }
    })
  })
}
