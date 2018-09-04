var db = require('../config/initializers/database');

// quickly get user based on cookie
module.exports = function(router) {
  router.route('/:selectorType/:selector')
  .get(function(req, res) {
    let userid = 0;
    if(req.session.userid) {
      userid = req.session.userid;
    }
    var selectorType = req.params.selectorType;
    var selector = req.params.selector;
    // db.getUser('userid', userid, function(err, results) {
    db.getUser(selectorType, selector, function(err, results) {
      if(err) {
        res.status(500).send("Server error");
      }
      else {
        if(results[0]) {
          if(results[0].id === userid) {
            results[0].isMe = true;
          }
          else {
            results[0].isMe = false;
          }
          let theirId = results[0].id;
          db.getLove(theirId, userid, function(err, loveAmt) {
            if(err) {
              results[0]["love_amount"] = 0;
            }
            else {
              results[0]["love_amount"] = loveAmt;
              res.json(results[0]);
            }
          })
        }
        else {
          res.json({fake_user: true});
        }

      }
    })
  })
}
