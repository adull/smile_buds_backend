var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {

    let user = req.session.user;
    let userid = req.session.userid;
    let hash = req.params.hash;

    if(user === undefined || userid === undefined || user === '' || userid === '') {
      res.json({grinned: false});
      return;
    }
    if(hash === undefined || hash === "undefined") {
      res.json({grinned: false});
      return;
    }
    else {
      db.didIGrinAt(hash, userid, function(err, results) {
        if(err) {
          res.status(500).send("Server error");
        }
        else {
          // console.log(results);
          if(results) {
            if(results.length > 0) {
              res.json({grinned: true});
            }
            else {
              res.json({grinned: false});
            }
          }
          else {
            res.json({grinned: false});
          }
        }
      })
    }
  })
}
