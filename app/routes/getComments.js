var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res, next) {
    let hash = req.params.hash;

    let userid = req.session.userid;
    let isAdmin = false;

    db.getComments(hash, function(err, getCommentsResults) {
      if(err) {
        // console.log("send this")
        res.status(500).send("Server error");
        return;
      }
      else {
        db.getPost(hash, function(err, getPostResult) {
          if(err) {
            // console.log(err);
            // console.log("error in get user db call");
            // console.log(err);
            res.status(500).send("Server error");
            return;
          }
          if(getPostResult[0]) {
            // console.log("there is a result")
            if(getPostResult[0].poster_id === userid) {
              for(var i = 0; i < getCommentsResults.length; i ++) {
                getCommentsResults[i].deletePermission = true;
              }
              if(getCommentsResults) {
                res.json(getCommentsResults);
                return;
              }
              else {
                res.end();
                return;
              }
            }
          }
          else if(userid) {
            // console.log("hash: " + hash);
            console.log("there is not a result in getting the post")
            db.getUser('userid', userid, function(err, getUserResult) {
              if(err) {
                res.status(500).send("Server error");
                return;
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
                return;
              }
              else {
                res.end();
                return;
              }
              // return;
            })
          }
          else {
            for(var i = 0; i < getCommentsResults.length; i ++) {
              getCommentsResults[i].deletePermission = false;
            }
            if(getCommentsResults) {
              res.json(getCommentsResults);
              return;
            }
            else {
              res.end();
              return;
            }
            return;
          }
        })
        // res.json(results)
        // res.end();
        // return;
      }
    })
  })
}
