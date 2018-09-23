var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res, next) {
    try {
      let hash = req.params.hash;
      let userid = req.session.userid;
      let userIdentifier = req.session.identifier;
      let isAdmin = false;

      db.getComments(hash, function(err, getCommentsResults) {
        if(err) {
          res.status(500).send("Server error");
          return;
        }
        else {
          db.getPost(hash, function(err, getPostResult) {
            if(err) {
              res.status(500).send("Server error");
              return;
            }
            else if(getPostResult[0].poster_id === userid) {
              for(var i = 0; i < getCommentsResults.length; i ++) {
                getCommentsResults[i].deletePermission = true;
              }
              if(getCommentsResults) {
                var commentGrinsArr = [];
                var individualCommentGrinsArr = [];
                db.getCommentGrins(getCommentsResults, function(err, getCommentGrinsResults) {
                  if(err) {
                    res.status(500).send("Server error");
                    return;
                  }
                  else {
                    for(var i = 0; i < getCommentGrinsResults.length; i++) {
                      if(userIdentifier) {
                        if(getCommentGrinsResults[i].grinner_identifier === userIdentifier) {
                          getCommentGrinsResults[i].didIGrin = true;
                        }
                        else {
                          getCommentGrinsResults[i].didIGrin = false;
                        }
                      }
                      else {
                        getCommentGrinsResults[i].didIGrin = false;
                      }
                    }
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
                res.end();
                return;
              }
            }
            else if(userid) {
              console.log("there is a user -" + hash)
              db.getUser('userid', userid, function(err, getUserResult) {
                if(err) {
                  console.log(65 + "-" + hash)
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
                  console.log("get comments results is not null -" + hash)
                  var commentGrinsArr = [];
                  var individualCommentGrinsArr = [];
                  db.getCommentGrins(getCommentsResults, function(err, getCommentGrinsResults) {
                    if(err) {
                      console.log(94 + "-" + hash)
                      res.status(500).send("Server error");
                      return;
                    }
                    else {
                      for(var i = 0; i < getCommentGrinsResults.length; i++) {
                        if(userIdentifier) {
                          if(getCommentGrinsResults[i].grinner_identifier === userIdentifier) {
                            getCommentGrinsResults[i].didIGrin = true;
                          }
                          else {
                            getCommentGrinsResults[i].didIGrin = false;
                          }
                        }
                        else {
                          getCommentGrinsResults[i].didIGrin = false;
                        }
                      }
                      if(getCommentsResults && getCommentGrinsResults) {
                        console.log(113 + "-" + hash)
                        res.json({commentResults: getCommentsResults, commentGrins: getCommentGrinsResults});
                        return;
                      }
                      else {
                        console.log("there isn't get comments results or get comment grins results")
                        res.end();
                      }
                    }
                  })
                }
                else {
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
                var individualCommentGrinsArr = [];
                db.getCommentGrins(getCommentsResults, function(err, getCommentGrinsResults) {
                  if(err) {
                    res.status(500).send("Server error");
                    return;
                  }
                  else {
                    for(var i = 0; i < getCommentGrinsResults.length; i++) {
                      if(userIdentifier) {
                        if(getCommentGrinsResults[i].grinner_identifier === userIdentifier) {
                          getCommentGrinsResults[i].didIGrin = true;
                        }
                        else {
                          getCommentGrinsResults[i].didIGrin = false;
                        }
                      }
                      else {
                        getCommentGrinsResults[i].didIGrin = false;
                      }
                    }
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
                res.end();
                return;
              }
            }
          })
        }
      })
    }
    catch(error) {
      console.log(171)
      console.log(error);
      res.end();
    }

  })
}
