var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res, next) {
    let hash = req.params.hash;
    let userid = req.session.userid;
    let userIdentifier = req.session.identifier;
    let isAdmin = false;

    db.getComments(hash, function(err, getCommentsResults) {
      if(err) {
        // console.log(14)
        res.status(500).send("Server error");
        return;
      }
      else {
        db.getPost(hash, function(err, getPostResult) {
          if(err) {
            // console.log(21);
            res.status(500).send("Server error");
            return;
          }
          if(getPostResult[0].poster_id === userid) {
            for(var i = 0; i < getCommentsResults.length; i ++) {
              getCommentsResults[i].deletePermission = true;
            }
            if(getCommentsResults) {
              var commentGrinsArr = [];
              var individualCommentGrinsArr = [];
              db.getCommentGrins(getCommentsResults, function(err, getCommentGrinsResults) {
                if(err) {
                  // console.log(34)
                  res.status(500).send("Server error");
                  return;
                }
                else {
                  for(var i = 0; i < getCommentGrinsResults.length; i++) {
                    if(userIdentifier) {
                      if(getCommentGrinsResults[i].grinner_identifier === userIdentifier) {
                        getCommentGrinsResults[i].didIGrin = true;
                      }
                    }
                    else {
                      getCommentGrinsResults[i].didIGrin = false;
                    }
                  }
                  // console.log(49)
                  res.json({commentResults: getCommentsResults, commentGrins: getCommentGrinsResults});
                  return;
                }
              })
            }
            else {
              // console.log(56)
              res.end();
              return;
            }
          }
          // }
          else if(userid) {
            db.getUser('userid', userid, function(err, getUserResult) {
              if(err) {
                console.log(65)
                res.status(500).send("Server error");
                return;
              }
              if(getUserResult[0]) {
                if(getUserResult[0].type === "admin") {
                  isAdmin = true;
                }
              }
              for(var i = 0; i < getCommentsResults.length; i ++) {
                if(isAdmin) {
                  getCommentsResults[i].deletePermission = true;
                }
                else if(getCommentsResults[i].commenter_id === userid) {
                  getCommentsResults[i].deletePermission = true
                }
                else {
                  getCommentsResults[i].deletePermission = false;
                }
              }
              if(getCommentsResults) {
                var commentGrinsArr = [];
                var individualCommentGrinsArr = [];
                db.getCommentGrins(getCommentsResults, function(err, getCommentGrinsResults) {
                  if(err) {
                    console.log(90)
                    res.status(500).send("Server error");
                    return;
                  }
                  else {
                    for(var i = 0; i < getCommentGrinsResults.length; i++) {
                      if(userIdentifier) {
                        if(getCommentGrinsResults[i].grinner_identifier === userIdentifier) {
                          getCommentGrinsResults[i].didIGrin = true;
                        }
                      }
                      else {
                        getCommentGrinsResults[i].didIGrin = false;
                      }
                    }
                    console.log(105)
                    if(getCommentsResults && getCommentGrinsResults) {
                      res.json({commentResults: getCommentsResults, commentGrins: getCommentGrinsResults});
                      return;
                    }
                    else {
                      res.end();
                    }
                  }
                })
              }
              else {
                console.log(112)
                res.end();
                return;
              }
            })
          }
          else {
            for(var i = 0; i < getCommentsResults.length; i ++) {
              getCommentsResults[i].deletePermission = false;
            }
            if(getCommentsResults) {
              // var commentGrinsArr = [];
              var individualCommentGrinsArr = [];
              db.getCommentGrins(getCommentsResults, function(err, getCommentGrinsResults) {
                if(err) {
                  // console.log(127)
                  res.status(500).send("Server error");
                  return;
                }
                else {
                  for(var i = 0; i < getCommentGrinsResults.length; i++) {
                    if(userIdentifier) {
                      if(getCommentGrinsResults[i].grinner_identifier === userIdentifier) {
                        getCommentGrinsResults[i].didIGrin = true;
                      }
                    }
                    else {
                      getCommentGrinsResults[i].didIGrin = false;
                    }
                  }
                  // console.log(141)
                  res.json({commentResults: getCommentsResults, commentGrins: getCommentGrinsResults});
                  return;
                }
              })
            }
            else {
              // console.log(149)
              res.end();
              return;
            }
          }
        })
      }
    })
  })
}
