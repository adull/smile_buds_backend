
module.exports = function(router) {
  router.route('/')
  .get(function(req, res) {
    req.session = null;
    res.json({success: true});
    res.end();
  })
}
