var db = require('../config/initializers/database');
let multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
  }
});
var upload = multer({ storage : storage}).single('image');


module.exports = function(router) {
  router.route('/')
  .post(function(req, res, next) {
    upload(req, res, function(err) {
      if(err) {
        console.log(err);
        res.end();
        return;
      }
      else {
        let posts = req.body.hashes;
        let postsArr = posts.split(",");
        db.getSpecificPosts(postsArr, function(err, results) {
          if(err) {
            res.status(500).send("Server error");
            return;
          }
          else {
            // console.log(results);
            res.json(results)
          }
        })
        // res.end();
      }
    })
  })
}
