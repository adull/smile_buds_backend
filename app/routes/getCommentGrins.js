var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:id')
  .get(function(req, res) {
    // console.log(req.session);
    let grinnedAt = false;
    let userIdentifier = req.session.identifier
    let commentID = req.params.id;
    if(commentID) {
      db.getCommentGrins(commentID, function(err, results) {
        if(err) {
          res.status(500).send("Server error");
        }
        else {
          for(let i = 0; i < results.length; i ++) {
            if(results[i].grinner_identifier === userIdentifier) {
              grinnedAt = true;
              break;
            }
          }
          res.json({grins: results, grinnedAt: grinnedAt});
        }
      })
    }
  })
}
