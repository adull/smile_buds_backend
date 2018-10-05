var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/')
  .get(function(req, res, next) {
    res.send("test");
  })
}
