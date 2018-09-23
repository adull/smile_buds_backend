var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:id')
  .post(function(req, res) {
    let userIdentifier = req.session.identifier;
    let userName = req.session.user;
    let commentID = req.params.id;
    if(userName === undefined || userIdentifier === undefined) {
      res.json({fail: "no-user"});
      return;
    }
    else if(commentID) {
      db.doesCommentGrinExist(commentID, userIdentifier, function(err, doesGrinExistResult) {
        if(doesGrinExistResult.length === 0) {
          db.grinAtComment(commentID, userIdentifier, userName, function(err, results) {
            if(err) {
              res.status(500).send("Server error");
              return;
            }
            else {
              res.json({success: true});
              return;
            }
          })
        }
        else {
          res.end();
          return;
        }
      })

    }
    else {
      res.json({fail: 'other'})
    }
  })
}
