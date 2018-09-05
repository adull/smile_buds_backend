var db = require('../config/initializers/database');
const sgMail = require('@sendgrid/mail');
var bcrypt = require('bcrypt');

function makePassword() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = function(router) {
  router.route('/')
  .post(function(req, res) {

    let email = req.body.email;
    let saltRounds = 10;
    let salt = bcrypt.genSaltSync(saltRounds);

    let newPassword = makePassword();
    let hashedPassword = bcrypt.hashSync(newPassword, salt);

    db.getUserWithEmail(email, function(err, result) {
      if(err) {
        res.status(500).send("Server error :~()");
        return;
      }
      else {
        if(result[0]) {
          let identifier = result[0].identifier;
          let user = result[0].first_name;
          db.editProfilePassword(hashedPassword, identifier, function(err, result) {
            if(err) {
              res.status(500).send("Server error :~()");
              return;
            }
            else {
              // console.log(process.env);
              // console.log(process.env.SENDGRID_API_KEY);
              sgMail.setApiKey('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');
              const msg = {
                to: email,
                from: 'no-reply@smilebuddies.lol',
                subject: 'Your new SmileBuddies password',
                text: 'Hello, ' + user + '. You recently requested a new password for your account on smilebuddies.lol. Your new password is ' + newPassword + '. To change your password to something you will be more likely to remember, login with this new password, go to your profile by clicking on your name or picture once you log in, and click "Edit profile". This will open a form where you can change your password. Happy smiling!',
                html: 'Hello, ' + user + '. You recently requested a new password for your account on smilebuddies.lol. Your new password is <strong>' + newPassword + '</strong>. To change your password to something you will be more likely to remember, login with this new password, go to your profile by clicking on your name or picture once you log in, and click "Edit profile". This will open a form where you can change your password. Happy smiling!',
              };
              // might be some problem here
              sgMail.send(msg);
            }
            res.json({success: true});
            return;
          })
        }
        else {
          res.json({success: false});
          return;
        }
      }
    })
  })
}
