var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res, next) {
    // console.log("swaggin");
    let hash = req.params.hash;
    db.getPost(hash, function(err, result) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        console.log(result[0])
        res.json(result[0]);
      }
    })
  })
}
