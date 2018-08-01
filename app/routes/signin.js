var db = require('../config/initializers/database');
var bcrypt = require('bcrypt');
var session = require('express-session');

module.exports = function(router) {
  router.route('/')
  .post(function(req, res, next) {
    // console.log(req.body);
    let email = req.body.email;
    let password = req.body.password;

    db.getUser('email', email, function(err, results) {
      if(err) {
        console.log(err);
        res.status(500).send("Server error");
      }
      else {
        var savedPass = results[0].password;
        if(bcrypt.compareSync(password, savedPass)) {
          req.session.userid = results[0].id;
          req.session.user = results[0].first_name;
          res.json({success: true});
        }
        else {
          // console.log("false");
          res.json({success: false});
        }
      }
    })
  })
}
