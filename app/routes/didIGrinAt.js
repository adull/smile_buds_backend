var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {

    let user = req.session.user;
    let userid = req.session.userid;
    let hash = req.params.hash;

    if(user === undefined) {
      // res.json({success: "no-user"})
      return;
    }
    if(hash === "undefined") {
      return;
    }
    else {

      db.getGrins(hash, function(err, results) {
        if(err) {
          console.log("yeah this");
          res.status(500).send("Server error");
        }
        else {
          for(let i = 0; i < results.length; i ++) {
            if(results[i].user_id === userid) {
              res.json({grinned: true});
              return;
            }
          }
          res.json({grinned: false});
        }
      })
    }
  })
}
