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
// var storage = multer();
var upload = multer({ storage : storage}).single('image');
// var upload = multer().single('image');
var fs = require('file-system');

function makeHash() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = function(router) {
  router.route('/')
  .post(function(req, res, next) {
    upload(req,res,function(err){
      //copied from https://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime
      function twoDigits(d) {
        if(0 <= d && d < 10) return "0" + d.toString();
        if(-10 < d && d < 0) return "-0" + (-1*d).toString();
        return d.toString();
      }

      Date.prototype.toMysqlFormat = function() {
        return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
      };

      let currentTime = new Date().toMysqlFormat();
      let hashIsUnique = false;
      let randomHash = '';
        randomHash = makeHash();
      let post = {
        hash: randomHash,
        time: currentTime,
        subject: req.body.subject,
        message: req.body.message,
        reason: req.body.reason,
        poster_id: req.session.userid,
        grins: 0,
        recent_grin: '',
        image: 1
      }
      fs.readFile(req.file.path, function (err, data) {
        let newPath = __dirname + "/uploads/" + randomHash + ".png";
        fs.writeFile(newPath, data, function (err) {
          if(err){
            console.log('ERR IN IMAGEPOST -- WRITEFILE')
            console.log(err);
          }
        });
      });

      db.textPost(post, function(err, results) {
        if(err) {
          res.status(500).send("Server error");
        }
        else {
          res.json({success: true});
        }
      })
    });
  })
}
