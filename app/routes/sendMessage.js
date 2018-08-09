var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:recipientId')
  .post(function(req, res, next) {

    function twoDigits(d) {
      if(0 <= d && d < 10) return "0" + d.toString();
      if(-10 < d && d < 0) return "-0" + (-1*d).toString();
      return d.toString();
    }

    Date.prototype.toMysqlFormat = function() {
      return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
    };
    let currentTime = new Date().toMysqlFormat();
    let senderId = req.session.userid;
    let recipientId = req.params.recipientId;
    let post = {
      sender: senderId,
      recipient: recipientId,
      message: req.body.message,
      time: currentTime,
      read_receipt: 0
    }
    db.sendMessage(post, function(err, result) {
      if(err) {
        res.status(500).send("Server error")
      }
      else {
        let senderId = req.session.userid;
        let senderName = req.session.user;
        let recipientId = req.params.recipientId;
        db.messageNotification(recipientId, senderId, senderName, function(err, result) {
          if(err) {
            res.status(500).send("Server error")
          }
          else {
            res.json({success: true});
          }
        })
      }
    })
  })
}
