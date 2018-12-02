var db = require('../config/initializers/database');

function makeHash() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = function(router) {
  router.route('/:feedName')
  .post(function(req, res, next) {
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
    let feedName = req.params.feedName;
    console.log(feedName);
    let post = {
      feed_name: feedName,
      hash: randomHash,
      time: currentTime,
      subject: req.body.subject,
      message: req.body.message,
      reason: req.body.reason,
      poster_id: req.session.userid,
      image: 0
    }
    db.textPost(post, function(err, results) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        res.json({
          success: true,
          hash: post.hash
        });
      }
    })
  })
}
