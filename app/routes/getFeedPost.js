var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res, next) {
    let hash = req.params.hash;
    db.getPost(hash, function(err, result) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        res.json(result[0]);
      }
    })
  })
}
