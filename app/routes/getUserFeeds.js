var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    db.getUserFeeds(function(err, results) {
      if(err) {
        console.log(err);
        res.status(500).send("Server error");
      }
      else {
        res.json(results);
      }
    })
  })
}
