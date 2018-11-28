module.exports = function(router) {
  router.route('/')
  .get(function(req, res, next) {
    // console.log(req.device);
    res.json(req.device);
  })
}
