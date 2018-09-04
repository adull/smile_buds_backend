var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res, next) {

    let hash = req.params.hash;
    let userid = req.session.userid;

    db.getPost(hash, function(err, getPostResult) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        if(getPostResult[0]) {
          if(userid) {
            db.getUser('userid', userid, function(err, getUserResult) {
              if(err) {
                res.status(500).send("Server error :~()");
                return;
              }
              if(getUserResult[0].type === "admin") {
                getPostResult[0].deletePermission = true;
              }
              // console.log(result[0]);
              else if(userid === getUserResult[0].poster_id) {
                getPostResult[0].deletePermission = true;
              }
              else {
                getPostResult[0].deletePermission = false;
              }
              res.json(getPostResult[0]);
            })
          }
          else {
            getPostResult[0].deletePermission = false;
            res.json(getPostResult[0]);
          }
        }
        else {
          res.json({error_reason: "no-post"})
        }

      }
    })
  })
}
