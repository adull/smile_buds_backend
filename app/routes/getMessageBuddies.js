var db = require('../config/initializers/database');

function messagePreview(message) {
  if(message.length > 20) {
    return message.substr(0,20) + "...";
  }
  else {
    return message;
  }
}

module.exports = function(router) {
  router.route('/')
  .get(function(req, res, next) {
    var userid = req.session.userid;
    if(userid) {
      db.getAllMessages(userid, function(err, results) {
        if(err) {
          console.log(err);
          res.status(500).send("Server error");
        }
        else {
          let uniqueMessageBuddies = [];
          var messageBuddiesData = [];
          for(var i = 0; i < results.length; i ++) {
            var otherPerson = -1;
            if(results[i].sender === userid) {
              otherPerson = results[i].recipient;
            }
            else if(results[i].recipient === userid) {
              otherPerson = results[i].sender;
            }
            if(uniqueMessageBuddies.includes(otherPerson)) {
              continue;
            }
            else {
              // console.log("results[i]")
              // console.log(results[i])
              uniqueMessageBuddies.push(otherPerson);
              results[i]["me"] = userid;
              results[i]["them"] = otherPerson;
              results[i]["message_preview"] = messagePreview(results[i].message);
              messageBuddiesData.push(results[i]);
            }
          }
          res.json(messageBuddiesData);
        }
      })
    }
  })
}