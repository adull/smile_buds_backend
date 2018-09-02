
module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    console.log("logout")
    // delete req.session;
    // req.session.user = '';
    // req.session.userid = '';
    req.session = null;
    res.json({success: true});
    res.end();
  })
}
