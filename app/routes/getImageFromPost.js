module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {
    let hash = req.params.hash;
    let path = '/uploads/' + hash + '.png';
    let fuckYou = '/profile-pictures/a.png';
    if(hash === undefined || hash === '') {
      res.sendFile(fuckYou, {root:__dirname});
    }
    res.sendFile(path, {root:__dirname});
  })
}
