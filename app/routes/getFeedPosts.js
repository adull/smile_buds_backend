var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:identifier/:postsReceived')
  .get(function(req, res) {
    let userid = req.session.userid;
    let isAdmin = false;

    let identifier = req.params.identifier;
    let postsReceived = req.params.postsReceived;
    if(identifier === "all") {
      db.getPosts(identifier, postsReceived, function(err, getPostsResults) {
        if(err) {
          res.status(500).send("Server error :~(");
        }
        else {
          if(userid) {
            db.getUser('userid', userid, function(err, result) {
              if(result[0].type === "admin") {
                isAdmin = true;
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
    }
    else {
      if(identifier) {
        db.getUser('identifier', identifier, function(err, result) {
          if(err) {
            res.status(500).send("Server error :~(");
          }
          else {
            // let id = result[0];
            let id = result[0].id;
            db.getPosts(id, postsReceived, function(err, getPostsResults) {
              if(err) {
                res.status(500).send("Server error :~(");
              }
              else {
                if(userid) {
                  db.getUser('userid', userid, function(err, result) {
                    if(result[0].type === "admin") {
                      isAdmin = true;
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
          }
        })
      }
    }
  })
}
