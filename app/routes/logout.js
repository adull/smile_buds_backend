var session = require('express-session');

module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    // delete req.session;
    req.session.user = '';
    req.session.userid = '';
    res.json({success: true});
    res.end();
  })
}
