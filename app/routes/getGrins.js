var db = require('../config/initializers/database');


module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {
    let hash = req.params.hash;

    db.getGrins(hash, function(err, results) {
      if(err) {
        console.log("error in get grins");
        console.log(err);
        res.status(500).send("Server error :~(");
        return;
      }
      else {
        res.json(results);
        return;
      }
    })
  })
}
