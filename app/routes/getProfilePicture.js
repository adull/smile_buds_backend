module.exports = function(router) {
  router.route('/:hash')
  .get(function(req, res) {
    let hash = req.params.hash;
    let path = '/profile-pictures/' + hash + '.png';
    let fuckYou = '/profile-pictures/a.png';
    if(hash === undefined || hash === '') {
      console.oog("send default");
      res.sendFile(fuckYou, {root:__dirname});
      console.log("ok its sent")
      return;
    }
    else {
      console.oog("send this one");
      res.sendFile(path, {root:__dirname});
      console.log("ok its sent")
      return;
    }
  })
}
