var db = require('../config/initializers/database');
var session = require('express-session');

// quickly get user based on cookie
module.exports = function(router) {
  router.route('/:selectorType/:selector')
  .get(function(req, res) {
    // console.log("okay")
    var selectorType = req.params.selectorType;
    var selector = req.params.selector;
    // db.getUser('userid', userid, function(err, results) {
    db.getUser(selectorType, selector, function(err, results) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        // console.log(results[0])
        res.json(results[0]);
      }
    })
  })
}
