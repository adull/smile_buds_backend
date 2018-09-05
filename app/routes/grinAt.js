var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .post(function(req, res) {
    let user = req.session.user;
    let userid = req.session.userid;
    let userIdentifier = req.session.identifier;
    let hash = req.params.hash;

    if(user === undefined || userid === undefined) {
      res.json({fail: "no-user"});
      return;
    }
    else {
      db.doesGrinExist(hash, userid, function(err, doesGrinExistResult) {
        if(doesGrinExistResult.length === 0) {
          db.grinAt(hash, userid, user, userIdentifier, function(err, results) {
            if(err) {
              res.status(500).send("Server error");
            }
            else {
              let user = req.session.user;
              let userid = req.session.userid;
              let hash = req.params.hash;
              db.getPoster(hash, function(err, result) {
                if(err) {
                  res.status(500).send("Server error");
                }
                else {
                  if(result[0]) {
                    if(result[0].poster_id) {
                      db.postNotification(result[0].poster_id, userid, user, hash, function(err, postResult) {
                        if(err) {
                          res.status(500).send("Server error");
                        }
                        else {
                          var posterId = result[0].poster_id;
                          if(posterId) {
                            db.addLove(userid, posterId, function(err, result) {
                              if(err) {
                                res.status(500).send("Server error");
                              }
                              else {
                                res.json({success: true});
                              }
                            })
                          }
                        }
                      })
                    }
                    else {
                      db.addLove(userid, posterId, function(err, result) {
                        if(err) {
                          res.status(500).send("Server error");
                        }
                        else {
                          res.json({success: true});
                        }
                      })
                    }
                  }
                  else {
                    res.end();
                  }
                }
              })
            }
          })
        }
        else {
          res.end();
        }
      })
    }
  })
}
