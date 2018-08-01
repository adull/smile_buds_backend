var db = require('../config/initializers/database');
var bcrypt = require('bcrypt');
let multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // console.log(req.body)
    callback(null, '../uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname.substring(0,file.originalname.lastIndexOf('.')) + '-' + Date.now() + file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length));
  }
});
var upload = multer({ storage : storage}).single('image');
var fs = require('file-system');

const saltRounds = 10;

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
      var identifier = makeIdentifier(req.body.first_name)
      var signup = {
        identifier: identifier,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        hobby: req.body.hobby,
        lovers: '{}',
        email: req.body.email,
        password:bcrypt.hashSync(req.body.password, salt)
      };
      fs.readFile(req.file.path, function (err, data) {
        // let oneDirUp = __dirname.substring(0, __dirname.length - 7);
        let newPath = __dirname + "/profile-pictures/" + identifier + ".png";
        fs.writeFile(newPath, data, function (err) {
          if(err){
            console.log('ERR IN IMAGEPOST -- WRITEFILE')
            console.log(err);
          }
        });
      });
      db.signup(signup, function(err, results) {
        if(err) {
          res.status(500).send("Server error :~(");
        }
        else {
          res.json({success: true});
        }
      })

      })
    });
}
