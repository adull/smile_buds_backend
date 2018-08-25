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
  router.route('/:otherUser')
  .get(function(req, res, next) {
    var userid = req.session.userid;
    var otherUser = req.params.otherUser;
    if(userid) {
      db.getMessagesBetween(userid, otherUser, function(err, results) {
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
