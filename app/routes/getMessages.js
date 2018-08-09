var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:userid')
  .get(function(req, res) {
    var userid = req.session.userid;
    let chattingWith = req.params.userid;
    db.getMessages(userid, chattingWith, function(err, results) {
      if(err) {
        console.log(err);
        res.status(500).send("Server error");
      }
      else {
        for(i = 0; i < results.length; i ++) {
          if(results[i].sender === userid) {
            results[i]["them"] = false;
          }
          else {
            results[i]["them"] = true;
          }
        }
        res.json(results);
      }
    })
  })
}
