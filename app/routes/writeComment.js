var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:hash')
  .post(function(req, res, next) {
    let hash = req.params.hash
    let commenterID = req.session.userid;
    let commenterName = req.session.user;
    let commenterIdentifier = req.session.identifier;
    let comment = {
      post_hash: hash,
      commenter_id: commenterID,
      commenter_name: commenterName,
      commenter_identifier: commenterIdentifier,
      comment: req.body.comment
    }
    db.writeComment(comment, function(err, result) {
      if(err) {
        res.status(500).send("Server error")
      }
      else {
        res.json({success: true});
      }
    })
  })
}
