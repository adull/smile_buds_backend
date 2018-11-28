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
    console.log(req.body);
    res.end();
  })
}
