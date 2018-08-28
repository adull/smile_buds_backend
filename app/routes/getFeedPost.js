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
        if(result[0]) {
          res.json(result[0]);
        }
        else {
          res.json({reason: "no-post"})
        }
      }
    })
  })
}
