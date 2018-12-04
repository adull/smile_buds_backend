var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:feedProperty/:feedName')
  .post(function(req, res) {
    var feedProperty = req.params.feedProperty;
    var feedName = req.params.feedName;
    var userFeedUpdateBody = req.body;
    db.editUserFeed(userFeedUpdateBody, feedProperty, feedName, function(err, results) {
      if(err) {
        res.status(500).send("Server error :~(");
        return;
      }
      else {
        res.json({success: true});
        return;
      }
    })
  })
}
