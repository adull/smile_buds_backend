var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res, next) {
    let hash = req.params.hash;
    // console.log("==BEGIN NEW GET COMMENTS REQUEST FOR HASH " + hash + "==");


    let userid = req.session.userid;
    let isAdmin = false;

    db.getComments(hash, function(err, getCommentsResults) {
      if(err) {
        // console.log("send this")
        // console.log(13)
        res.status(500).send("Server error");
        return;
      }
      else {
        db.getPost(hash, function(err, getPostResult) {
          if(err) {
            // console.log(err);
            // console.log("error in get user db call");
            // console.log(err);
            // console.log(24)
            res.status(500).send("Server error");
            return;
          }
          if(getPostResult[0]) {
            // console.log("there is a result")
            if(getPostResult[0].poster_id === userid) {
              for(var i = 0; i < getCommentsResults.length; i ++) {
                // console.log("inside for loop - " + i)
                getCommentsResults[i].deletePermission = true;
              }
              // console.log("for ends")
              if(getCommentsResults) {
                // console.log(35)
                res.json(getCommentsResults);
                return;
              }
              else {
                // console.log(40)
                res.end();
                return;
              }
            }
            // return;
          }
          if(userid) {
            // console.log("userid exists")
            // console.log("hash: " + hash);
            // console.log("there is not a result in getting the post")
            db.getUser('userid', userid, function(err, getUserResult) {
              if(err) {
                // console.log(51)
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
                // console.log(70)
                res.json(getCommentsResults);
                return;
              }
              else {
                // console.log(75)
                res.end();
                return;
              }
              // return;
            })
          }
          else {
            // console.log("no userid")
            for(var i = 0; i < getCommentsResults.length; i ++) {
              getCommentsResults[i].deletePermission = false;
            }
            if(getCommentsResults) {
              // console.log(87)
              res.json(getCommentsResults);
              return;
            }
            else {
              // console.log(91)
              res.end();
              return;
            }
            // return;
          }
        })
        // console.log(99)
        // res.json(results)
        // res.end();
        // return;
      }
      // console.log(103)
      // res.end();
      // return;

    })
    // console.log(112)
    // res.end();
    // return;
    // console.log("==END GET COMMENTS REQUEST==");
  })
}
