var db = require('../config/initializers/database');
var bcrypt = require('bcrypt');

module.exports = function(router) {
  router.route('/')
  .post(function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    if(email && password) {
      db.getUserWithEmail(email, function(err, results) {
        if(err) {
          console.log(err);
          res.status(500).send("Server error");
        }
        else {
          if(results[0]) {
            var savedPass = results[0].password;
            if(bcrypt.compareSync(password, savedPass)) {
              req.session.userid = results[0].id;
              req.session.user = results[0].first_name;
              req.session.identifier = results[0].identifier;
              res.json({success: true});
            }
            else {
              res.json({success: false});
            }
          }
          else {
            res.json({success: false});
          }

        }
      })
    }
  })
}
