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

module.exports = function(router) {
  router.route('/')
  .post(function(req, res, next) {
    let identifier = req.session.identifier;
    if(identifier) {
      upload(req, res, function(err) {
        var salt = bcrypt.genSaltSync(saltRounds);
        let password = ''
        if(req.body.password === '') {
          password = ''
        }
        else if(req.body.password === undefined) {
          password = ''
        }
        else {
          password = bcrypt.hashSync(req.body.password, salt);
        }
        var editProfile = {
          hobby: req.body.hobby,
          email_notifications: req.body.email_notifications,
          password: password
        };
        if(req.file) {
          if(req.file.size > 5000000 ) {
            res.json({reason:"file-size"});
            return;
          }
          else {
            fs.readFile(req.file.path, function(err, data) {
              let imagePath = __dirname + "/profile-pictures/" + identifier + ".png";
              fs.unlink(imagePath, (err) => {
                if (err) throw err;
              })
              fs.writeFile(imagePath, data, function(err) {
                if(err){
                  console.log('ERR IN editpROFILE -- WRITEFILE')
                  console.log(err);
                }
                else {
                  Jimp.read(imagePath, (err, file) => {
                    if (err) throw err;
                    file
                        .resize(300, 300) // resize
                        .quality(60) // set JPEG quality
                        .write(imagePath); // save
                  });
                }
              })
            });
            if(editProfile.hobby === '') {
              if(editProfile.email_notifications === '') {
                if(editProfile.password === '') {
                  res.json({success: true})
                }
                else {
                  db.editProfilePassword(editProfile.password, identifier, function(err, result) {
                    if(err) {
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
              else {
                db.editProfileEmailNotifications(editProfile.email_notifications, identifier, function(err, result) {
                  if(err) {
                    res.status(500).send("Server error :~(");
                    return;
                  }
                  else if(editProfile.password === '') {
                    res.json({success: true})
                  }
                  else {
                    db.editProfilePassword(editProfile.password, identifier, function(err, result) {
                      if(err) {
                        res.status(500).send("Server error :~(");
                        return;
                      }
                      else {
                        res.json({success: true});
                        return;
                      }
                    })
                  }
                })
              }
            }
            else {
              db.editProfileHobby(editProfile.hobby, identifier, function(err, result) {
                if(err) {
                  res.status(500).send("Server error :~(");
                  return;
                }
                else {
                  if(editProfile.email_notifications === '') {
                    if(editProfile.password === '') {
                      res.json({success: true})
                    }
                    else {
                      db.editProfilePassword(editProfile.password, identifier, function(err, result) {
                        if(err) {
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
                  else {
                    db.editProfileEmailNotifications(editProfile.email_notifications, identifier, function(err, result) {
                      if(err) {
                        res.status(500).send("Server error :~(");
                        return;
                      }
                      else if(editProfile.password === '') {
                        res.json({success: true})
                      }
                      else {
                        db.editProfilePassword(editProfile.password, identifier, function(err, result) {
                          if(err) {
                            res.status(500).send("Server error :~(");
                            return;
                          }
                          else {
                            res.json({success: true});
                            return;
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          }
        }
        else {
          if(editProfile.hobby === '') {
            if(editProfile.email_notifications === '') {
              if(editProfile.password === '') {
                res.json({success: true})
              }
              else {
                db.editProfilePassword(editProfile.password, identifier, function(err, result) {
                  if(err) {
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
            else {
              db.editProfileEmailNotifications(editProfile.email_notifications, identifier, function(err, result) {
                if(err) {
                  res.status(500).send("Server error :~(");
                  return;
                }
                else if(editProfile.password === '') {
                  res.json({success: true})
                }
                else {
                  db.editProfilePassword(editProfile.password, identifier, function(err, result) {
                    if(err) {
                      res.status(500).send("Server error :~(");
                      return;
                    }
                    else {
                      res.json({success: true});
                      return;
                    }
                  })
                }
              })
            }
          }
          else {
            db.editProfileHobby(editProfile.hobby, identifier, function(err, result) {
              if(err) {
                res.status(500).send("Server error :~(");
                return;
              }
              else {
                if(editProfile.email_notifications === '') {
                  if(editProfile.password === '') {
                    res.json({success: true})
                  }
                  else {
                    db.editProfilePassword(editProfile.password, identifier, function(err, result) {
                      if(err) {
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
                else {
                  db.editProfileEmailNotifications(editProfile.email_notifications, identifier, function(err, result) {
                    if(err) {
                      res.status(500).send("Server error :~(");
                      return;
                    }
                    else if(editProfile.password === '') {
                      res.json({success: true})
                    }
                    else {
                      db.editProfilePassword(editProfile.password, identifier, function(err, result) {
                        if(err) {
                          res.status(500).send("Server error :~(");
                          return;
                        }
                        else {
                          res.json({success: true});
                          return;
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
    else {
      res.end();
    }
  })
}
