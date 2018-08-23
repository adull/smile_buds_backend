var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res, next) {
    let hash = req.params.hash;
    db.getComments(hash, function(err, results) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        res.json(results)
      }
    })
  })
}
