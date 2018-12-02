var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:feedName')
  .get(function(req, res) {
    var myIdentifier = req.session.identifier;
    var feedName = req.params.feedName;
    db.getUserFeed(feedName, function(err, results) {
      if(err) {
        console.log(err);
        res.status(500).send("Server error");
      }
      else {
        if(results[0].admin === myIdentifier) {
          results[0].admin_privilege = true;
        }
        else {
          results[0].admin_privilege = false;
        }
        res.json(results);
      }
    })
  })
}
