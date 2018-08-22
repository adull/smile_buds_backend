var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:theirID')
  .get(function(req, res) {
    let myID = req.session.userid;
    let theirID = req.params.theirID;
    if(userid) {
      db.removeMessageNotificaitons(myID, theirID, function(err, result) {
        if(err) {
          res.status(500).send("Server error");
        }
        else {
          res.json(result);
        }
      })
    }
    else {
      console.log("user logged out before they could click on da shit");
      res.end();
    }
  })
}
