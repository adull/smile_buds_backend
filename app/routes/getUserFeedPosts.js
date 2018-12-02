var db = require('../config/initializers/database');

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
                  // console.log("get user feed posts 25")
                  // console.log(getUserResult[0])
                  // console.log(getPostsResults);
                  if(getUserResult[0].type === "admin") {
                    isAdmin = true;
                  }
                  else {
                    db.getUserFeed(feedName, function(err, getUserFeedResult) {
                      if(err) {
                        console.log(err);
                        res.status(500).send("Server error");
                      }
                      else {
                        if(getUserResult[0].identifier === getUserFeedResult[0].admin) {
                          console.log("i am the admin")
                          isAdmin = true;
                        }
                       }
                    })
                  }
                }
              }
              for(var i = 0; i < getPostsResults.length; i ++) {
                if(isAdmin) {
                  getPostsResults[i].deletePermission = true;
                }
                else if(getPostsResults[i].poster_id === userid ) {
                  getPostsResults[i].deletePermission = true;
                }
                else {
                  getPostsResults[i].deletePermisson = false;
                }
              }
              res.json(getPostsResults);
              return;
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
