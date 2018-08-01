module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {
    let hash = req.params.hash;
    let path = '/profile-pictures/' + hash + '.png';
    res.sendFile(path, {root:__dirname});
  })
}
