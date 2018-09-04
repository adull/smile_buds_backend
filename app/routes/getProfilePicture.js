module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {
    let hash = req.params.hash;
    let path = '/profile-pictures/' + hash + '.png';
    let fuckYou = '/profile-pictures/a.png';
    if(hash === undefined || hash === '') {
      res.sendFile(fuckYou, {root:__dirname});
      return;
    }
    else {
      res.sendFile(path, {root:__dirname});
      return;
    }
  })
}
