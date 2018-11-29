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
var upload = multer({ storage : storage});


module.exports = function(router) {
  router.route('/')
  .post(function(req, res) {
    // console.log(req.body);
    var newFeedData = req.body
    db.doesFeedExist(newFeedData.feedName, function(err, results) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        if(results.length > 0) {
          res.json({
            success: false,
            reason: 'name-exists'
          })
        }
        else {
          db.newFeed(newFeedData, function(err, results) {
            if(err) {
              res.status(500).send("Server error");
            }
            else {
              res.json({
                success: true
              })
            }
          })
        }
      }
    })

  })
}
