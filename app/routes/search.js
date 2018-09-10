var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/')
  .post(function(req, res, next) {
    // console.log(req.body);
    // res.end();
    let searchQuery = req.body.searchQuery;
    db.searchUserLike(searchQuery, function(err, searchUserResults) {
      if(err) {
        res.status(500).send("Server error");
        return;
      }
      else {
        // console.log(searchUserResults);
        res.json({results: searchUserResults});
      }
    })
  })
}
