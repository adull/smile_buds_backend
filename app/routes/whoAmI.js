var db = require('../config/initializers/database');
var session = require('express-session');

// quickly get user based on cookie
module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    let isLoggedIn = false;
    if(req.session.user) {
      isLoggedIn = true;
    }
    res.json({
      user: req.session.user,
      userid: req.session.userid,
      isLoggedIn: isLoggedIn
    });
    res.end();
  })
}
