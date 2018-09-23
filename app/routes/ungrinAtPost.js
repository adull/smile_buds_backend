var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .post(function(req, res) {
    let user = req.session.user;
    let userid = req.session.userid;
    let hash = req.params.hash;

    if(user === undefined) {
      res.json({success: "no-user"});
      return;
    }

    db.ungrinAtPost(hash, userid, function(err, results) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        db.getPost(hash, function(err, getPostResult) {
          if(err) {
            res.status(500).send("Server error");
          }
          else {
            if(getPostResult) {
              posterId = getPostResult[0].poster_id;
              db.deleteLove(userid, posterId, function(err, removeLoveResult) {
                if(err) {
                  res.status(500).send("Server error");
                }
                else {
                  db.removeGrinNotification(userid, hash, function(err, result) {
                    if(err) {
                      res.status(500).send("Server error");
                    }
                    else {
                      res.json({success: true});
                    }
                  })
                }
              })
            }
            else {
              res.status(500).send("Server error");
            }
          }
        })
      }
    })
  })
}
