var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {
    let hash = req.params.hash;
    let userid = req.session.userid;

    // console.log(userid)
    db.getUser('userid', userid, function(err, getUserResult) {
      // console.log(getUserResult)
      if(err) {
        res.status(500).send("Server error");
      }
      else if(getUserResult[0].type === "admin") {
        db.deletePost(hash, function(err, deletePostResult) {
          if(err) {
            res.status(500).send("Server error");
          }
          else {
            res.json({success: true});
          }
        });
      }
      else {
        db.getPost(hash, function(err, getPostResult) {
          if(getPostResult[0].poster_id === userid) {
            if(err) {
              res.status(500).send("Server error");
            }
            db.deletePost(hash, function(err, deletePostResult) {
              if(err) {
                res.status(500).send("Server error");
              }
              else {
                res.json({success: true});
              }
            });
          }
        })
      }
    })
  })
}
