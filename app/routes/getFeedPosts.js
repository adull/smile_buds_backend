var db = require('../config/initializers/database');

module.exports = function(router) {
  router.route('/:identifier/:postsReceived')
  .get(function(req, res) {
    let identifier = req.params.identifier;
    let postsReceived = req.params.postsReceived;
    if(identifier === "all") {
      db.getPosts(identifier, postsReceived, function(err, results) {
        if(err) {
          res.status(500).send("Server error :~(");
        }
        else {
          res.json(results);
        }
      })
    }
    else {
      if(identifier) {
        db.getUser('identifier', identifier, function(err, result) {
          if(err) {
            res.status(500).send("Server error :~(");
          }
          else {
            // let id = result[0];
            let id = result[0].id;
            db.getPosts(id, postsReceived, function(err, results) {
              if(err) {
                res.status(500).send("Server error :~(");
              }
              else {
                // console.log(results);
                res.json(results);
              }
            })
          }
        })
      }
    }
  })
}
