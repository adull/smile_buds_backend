var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res, next) {
    let hash = req.params.hash;

    let userid = req.session.userid;
    let isAdmin = false;

    db.getComments(hash, function(err, getCommentsResults) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        db.getPost(hash, function(err, getPostResult) {
          if(err) {
            // console.log(err);
            console.log("error in get user db call");
            console.log(err);
            res.status(500).send("Server error");
          }
          if(getPostResult[0]) {
            if(getPostResult[0].poster_id === userid) {
              for(var i = 0; i < getCommentsResults.length; i ++) {
                getCommentsResults[i].deletePermission = true;
              }
              if(getCommentsResults) {
                res.json(getCommentsResults);
              }
              else {
                res.end();
              }
              return;
            }
          }
          else if(userid) {
            db.getUser('userid', userid, function(err, getUserResult) {
              if(err) {
                console.log("error in get user db call");
                console.log(err);
                res.status(500).send("Server error");
              }
              if(getUserResult[0].type === "admin") {
                isAdmin = true;
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
                res.json(getCommentsResults);
              }
              else {
                res.end();
              }
              return;
            })
          }
          else {
            for(var i = 0; i < getCommentsResults.length; i ++) {
              getCommentsResults[i].deletePermission = false;
            }
            if(getCommentsResults) {
              res.json(getCommentsResults);
            }
            else {
              res.end();
            }
            return;
          }
        })
        // res.json(results)
        res.end();
      }
    })
  })
}
