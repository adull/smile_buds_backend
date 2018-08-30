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
          if(getPostResult[0].poster_id === userid) {
            for(var i = 0; i < getCommentsResults.length; i ++) {
              getCommentsResults[i].deletePermission = true;
            }
            res.json(getCommentsResults);
            return;
          }
          else if(userid) {
            db.getUser('userid', userid, function(err, getUserResult) {
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
              res.json(getCommentsResults);
              return;
            })
          }
          else {
            for(var i = 0; i < getCommentsResults.length; i ++) {
              getCommentsResults[i].deletePermission = false;
            }
            res.json(getCommentsResults);
            return;
          }
        })
        // res.json(results)
      }
    })
  })
}
