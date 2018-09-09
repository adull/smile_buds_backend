var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:interval')
  .get(function(req, res) {
    let interval = req.params.interval;
    db.getBiggestGrins(interval, function(err, getBiggestGrinsResults) {
      if(err) {
        res.status(500).send("Server error");
        return;
      }
      else {
        res.json(getBiggestGrinsResults);
      }
    })
  })
}
