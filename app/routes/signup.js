var db = require('../config/initializers/database');
var bcrypt = require('bcrypt');
let multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
  }
});
var upload = multer({ storage : storage}).single('image');
var fs = require('fs');
var Jimp = require('jimp');



const saltRounds = 10;

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        }
    );
}

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function makeIdentifier(firstName) {
  let firstNameLower = firstName.toLowerCase();
  let niceWords = ['adaptable', 'adventurous', 'affectionate', 'ambitious',
  'amiable', 'compassionate', 'considerate', 'courageous', 'courteous',
  'diligent', 'empathetic', 'exuberant', 'friendly', 'generous', 'gregarious',
  'impartial', 'intuitive', 'inventive', 'loving', 'nice', 'passionate',
  'reliable', 'sincere', 'witty', 'funny', 'great']
  let arrayLength = niceWords.length;
  let numWords = 6;
  let indexValues = [];
  let identifierString = ""
  for(let i = 0; i < 6; i ++) {
    let potentialValue = Math.floor(Math.random() * arrayLength);
    while(indexValues.includes(potentialValue)) {
      potentialValue = Math.floor(Math.random() * arrayLength);
    }
    indexValues.push(potentialValue);
    identifierString = identifierString.concat(niceWords[potentialValue] + "-")
  }
  identifierString = identifierString.concat(firstNameLower);
  return identifierString;
}

module.exports = function(router) {
  router.route('/')
  .post(function(req, res, next) {
    upload(req,res,function(err){
      var salt = bcrypt.genSaltSync(saltRounds);
      var identifier = makeIdentifier(req.body.first_name.trim())
      let emailNotifications = 0;
      if(req.body.email_notifications === 'true') {
        emailNotifications = 1;
      }
      var signup = {
        identifier: identifier,
        first_name: toTitleCase(req.body.first_name.trim()),
        last_name: req.body.last_name.trim(),
        hobby: req.body.hobby,
        type: 'user',
        email: req.body.email.trim(),
        email_notifications: emailNotifications,
        password:bcrypt.hashSync(req.body.password, salt)
      };

      let ascii = /^[ -~]+$/;

      for(var propertyName in signup) {
        console.log(signup[propertyName]);
        if(!ascii.test(signup[propertyName])) {
          console.log("this one");
          console.log(signup[propertyName]);
          res.json({reason: "invalid-characters"});
        }
      }
      if(req.file.size > 5000000 ) {
        res.json({reason:"file-size"});
        return;
      }
      let emailExists = false;
      db.doesEmailExist(req.body.email, function(err, results) {
        if(err) {
          console.log("error in does email exist")
          res.status(500).send("Server error :~()");
          return;
        }
        else {
          if(results.length > 0) {
            res.json({reason: "email-exists"});
            return;
          }
          else {
            fs.readFile(req.file.path, function (err, data) {
              // let oneDirUp = __dirname.substring(0, __dirname.length - 7);
              let newPath = __dirname + "/profile-pictures/" + identifier + ".png";
              fs.writeFile(newPath, data, function (err) {
                if(err){
                  console.log('ERR IN IMAGEPOST -- WRITEFILE')
                  console.log(err);
                }
                else {
                  try {
                    Jimp.read(newPath, (err, file) => {
                      if (err) throw err;
                      file
                          .resize(300, 300) // resize
                          .quality(60) // set JPEG quality
                          .write(newPath); // save
                    });
                  }
                  catch(error) {}
                }
              });
            });
            db.signup(signup, function(err, results) {
              if(err) {
                console.log("err in db signup")
                console.log(err)
                res.status(500).send("Server error :~(");
                return;
              }
              else {
                res.json({success: true});
                return;
              }
            })
          }
        }
      })
      // if(emailExists === false) {

      // }
    })
  });
}
