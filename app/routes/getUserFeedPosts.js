var db = require('../config/initializers/database');

// this function is fucked lol
function setAdminPermissions(isAdmin, getPostsResults, userid, res) {
  for(var i = 0; i < getPostsResults.length; i ++) {
    if(isAdmin) {
      // console.log("is admin is true");
      getPostsResults[i].deletePermission = true;
    }
    else if(getPostsResults[i].poster_id === userid ) {
      // console.log("else if")
      getPostsResults[i].deletePermission = true;
    }
    else {
      // console.log("else")
      getPostsResults[i].deletePermisson = false;
    }
  }
  res.json(getPostsResults);
  return;
}

module.exports = function(router) {
  router.route('/:feedName/:postsReceived')
  .get(function(req, res) {
    let userid = req.session.userid;
    let isAdmin = false;


    let feedName = req.params.feedName;
    let postsReceived = req.params.postsReceived;
      db.getUserFeedPosts(feedName, postsReceived, function(err, getPostsResults) {
        if(err) {
          res.status(500).send("Server error :~(");
        }
        else {
          if(userid) {
            db.getUser('userid', userid, function(err, getUserResult) {
              if(err) {
                res.status(500).send("Server error :~()");
                return;
              }
              else {
                if(getUserResult[0]) {
                  if(getUserResult[0].type === "admin") {
                    isAdmin = true;
                    setAdminPermissions(isAdmin, getPostsResults, userid, res);
                  }
                  else {
                    db.getUserFeed(feedName, function(err, getUserFeedResult) {
                      if(err) {
                        console.log(err);
                        res.status(500).send("Server error");
                      }
                      else {
                        if(getUserResult[0].identifier === getUserFeedResult[0].admin) {
                          console.log("im the admin bitch")
                          isAdmin = true;
                        }
                        setAdminPermissions(isAdmin, getPostsResults, userid, res);
                       }
                    })
                  }
                }
              }
              // for(var i = 0; i < getPostsResults.length; i ++) {
              //   if(isAdmin) {
              //     console.log("is admin is true");
              //     getPostsResults[i].deletePermission = true;
              //   }
              //   else if(getPostsResults[i].poster_id === userid ) {
              //     console.log("else if")
              //     getPostsResults[i].deletePermission = true;
              //   }
              //   else {
              //     console.log("else")
              //     getPostsResults[i].deletePermisson = false;
              //   }
              // }
              // res.json(getPostsResults);
              // return;
            })
          }
          else {
            for(var i = 0; i < getPostsResults.length; i ++) {
              getPostsResults[i].deletePermission = false;
            }
            res.json(getPostsResults);
            return;
          }
        }
      })
  })
}
