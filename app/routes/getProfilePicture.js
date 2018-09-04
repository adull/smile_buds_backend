module.exports = function(router) {
  // router.route('/')
  // .get(function(req, res) {
  //   console.log("get profile picture request");
  //   console.log("hash: " + hash);
  //   // let path = '/profile-pictures/' + hash + '.png';
  //   let fuckYou = '/profile-pictures/a.png';
  //   console.log("send default");
  //   res.sendFile(fuckYou, {root:__dirname});
  //   console.log("ok its sent")
  //   return;
  //   }
  // });
  router.route('/:hash')
  .get(function(req, res) {
    console.log("get profile picture request");
    let hash = req.params.hash;
    console.log("hash: " + hash);
    let path = '/profile-pictures/' + hash + '.png';
    let fuckYou = '/profile-pictures/a.png';
    if(hash === undefined || hash === '') {
      console.log("send default");
      res.send("haha");
      res.sendFile(fuckYou, {root:__dirname}, function(err) {
        if(err) {
          console.log("err in sendfile")
          console.log(err)
          res.end();
          return;
        }
      });
      console.log("ok its sent")
      return;
    }
    else {
      console.log("send this one");
      res.sendFile(path, {root:__dirname}, function(err) {
        if(err) {
          console.log("err in sendfile")
          console.log(err)
          res.end();
          return;
        }
      });
      console.log("ok its sent")
      return;
    }
  })
}
