module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {
    let hash = req.params.hash;
    let path = '/uploads/' + hash + '.png';
    let fuckYou = '/profile-pictures/a.png';
    if(hash === undefined || hash === '') {
      console.log("send default avatar")
      res.sendFile(fuckYou, {root:__dirname});
      return;
    }
    else {
      console.log("send user avatar")
      res.sendFile(path, {root:__dirname});
      return;
    }
  })
}
