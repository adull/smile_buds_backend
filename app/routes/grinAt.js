var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .post(function(req, res) {
    let user = req.session.user;
    let userid = req.session.userid;
    let hash = req.params.hash;

    if(user === undefined || userid === undefined) {
      console.log("stop here - no user/userid");
      res.json({success: "no-user"});
      return;
    }
    else {
      db.grinAt(hash, userid, user, function(err, results) {
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
              if(result[0].poster_id) {
                // console.log(result[0].poster_id);
                db.postNotification(result[0].poster_id, userid, user, hash, function(err, postResult) {
                  if(err) {
                    res.status(500).send("Server error");
                  }
                  else {
                    res.json({success: true});
                  }
                })
              }
              else {
                console.log("line 41 grin at lol")
              }
            }
          })
        }
      })
    }
  })
}
