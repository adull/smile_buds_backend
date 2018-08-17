const mysql = require('mysql');

if(process.env.NODE_ENV === 'development') {
  var pool = mysql.createPool({
    user: 'root',
    password: 'root',
    host: 'localhost',
    port: '8889',
    database: 'smile_buds'
  });
}
else if(process.env.NODE_ENV === 'production') {
  var pool = mysql.createPool({
    user: 'root',
    password: 'root',
    host: 'localhost',
    port: '3306',
    database: 'smile_buds'
  });
}
//take signup form, put into db
exports.signup = function(signupData, callback) {
  var postSignupSql = "INSERT INTO user SET ?";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(postSignupSql, signupData, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.doesEmailExist = function(email, callback) {
  var getEmailSql = "SELECT * FROM user WHERE email='" + email + "';";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    else {
      connection.query(getEmailSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
          return;
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

//retrieve user row based on input
exports.getUser = function(searchBy, value, callback) {
  // console.log("inside get user in db")
  if(searchBy === 'email') {
    var getUserSql = "SELECT * FROM user WHERE email='" + value + "';";
  }
  if(searchBy === 'userid') {
    var getUserSql = "SELECT * FROM user WHERE id='" + value + "';";
  }
  if(searchBy === 'identifier') {
    var getUserSql = "SELECT * FROM user WHERE identifier='" + value + "';";
  }
  console.log(pool)
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err)
      callback(true);
      return;
    }
    else {
      connection.query(getUserSql, function(err, userResult) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
          return;
        }
        // console.log("USER RESULT:"  + userResult)
        callback(false, userResult);
      })
    }
  })
}

exports.textPost = function(textPostData, callback) {
  var postTextPostSql = "INSERT INTO post SET ?";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(postTextPostSql, textPostData, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.getPost = function(hash, callback) {
  var getPostSql = "SELECT * FROM post WHERE hash='" + hash + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    pool.getConnection(function(err, results) {
      if(err) {
        callback(true);
        return;
      }
      else {
        connection.query(getPostSql, function(err, result) {
          connection.release();
          if(err) {
            console.log(err);
            callback(true);
          }
          else {
            callback(false, result);
          }
        })
      }
    })
  })
}

exports.getPoster = function(hash, callback) {
  var getPosterSql = "SELECT poster_id FROM post WHERE hash='" + hash + "';";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getPosterSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.getPosts = function(id, postsReceived, callback) {
  var getPostsSql = "";
  if(id === "all") {
    getPostsSql = "SELECT * FROM post ORDER BY id DESC LIMIT " + postsReceived + ", 10";
  }
  else {
    getPostsSql = "SELECT * FROM post WHERE poster_id='" + id + "' ORDER BY id DESC LIMIT " + postsReceived + ", 10";
  }
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getPostsSql, function(err, result) {
        connection.release();
        if(err) {
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  });
}

exports.getGrins = function(hash, callback) {
  let getGrinnersSql = "SELECT user_id, user_name FROM post_grins WHERE post_hash='" + hash + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getGrinnersSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.grinAt = function(hash, userid, userName, callback) {
  if(userid) {
    let grinAtSql = "INSERT INTO post_grins (post_hash, user_id, user_name) VALUES('" + hash + "', " + userid + ", '" + userName + "')";
    // console.log(grinAtSql);
    pool.getConnection(function(err, connection) {
      if(err) {
        callback(true);
        return;
      }
      else {
        connection.query(grinAtSql, function(err, result) {
          connection.release();
          if(err) {
            console.log(err);
            callback(true);
          }
          else {
            // console.log("yeah this is good");
            callback(false, result);
          }
        })
      }
    })
  }
}

exports.ungrinAt = function(hash, userid, callback) {
  let ungrinSql = "DELETE FROM post_grins WHERE post_hash='" + hash + "' AND user_id=" + userid;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(ungrinSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.didIGrinAt= function(hash, userid, callback) {
  let didIGrinSql = "SELECT * FROM post_grins  WHERE post_hash='" + hash + "' AND user_id=" + userid;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(didIGrinSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.sendMessage = function(post, callback) {
  var sendMessageSql = "INSERT INTO messages SET ?";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(sendMessageSql, post, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.getMessagesBetween = function(userOne, userTwo, callback) {
  if(userOne && userTwo) {
    var getMessagesBetweenSql = "SELECT * FROM messages WHERE (recipient=" + userOne + " AND sender=" + userTwo + ") OR (sender=" + userOne + " AND recipient=" + userTwo + ")";
    pool.getConnection(function(err, connection) {
      if(err) {
        callback(true);
        return;
      }
      else {
        connection.query(getMessagesBetweenSql, function(err, result) {
          connection.release();
          if(err) {
            console.log(err);
            callback(true);
          }
          else {
            callback(false, result);
          }
        })
      }
    })
  }
  else {
    callback(true);
  }
}

exports.getAllMessages = function(userid, callback) {
  var getMessageBuddiesSql = "SELECT * FROM messages WHERE (recipient=" + userid + " OR sender=" + userid + ") ORDER BY id DESC";
  // console.log(getMessageBuddiesSql)
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getMessageBuddiesSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          // console.log(result);
          callback(false, result);
        }
      })
    }
  })
}

exports.getMessages = function(userid, messaging, callback) {
  if(userid && messaging) {
    var getMessageBuddiesSql = "SELECT * FROM messages WHERE (recipient=" + userid + " AND sender=" + messaging + ") OR (recipient=" + messaging + " AND sender=" +userid + ") ORDER BY id DESC";
    // console.log(getMessageBuddiesSql)
    pool.getConnection(function(err, connection) {
      if(err) {
        callback(true);
        return;
      }
      else {
        connection.query(getMessageBuddiesSql, function(err, result) {
          connection.release();
          if(err) {
            console.log(err);
            callback(true);
          }
          else {
            // console.log(result);
            callback(false, result);
          }
        })
      }
    })
  }
  else {
    callback(true);
  }
}

exports.messageNotification = function(toID, fromID, fromName, callback) {
  var messageNotificationSql = "INSERT INTO message_notifications (notification_type, notification_for, notification_from_id, notification_from_name) VALUES('message', " + toID + ", " + fromID + ", '" + fromName + "')";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(messageNotificationSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.postNotification = function(toID, fromID, fromName, postHash, callback) {
  var postNotificationSql = "INSERT INTO post_notifications (notification_type, notification_for, notification_from_id, notification_from_name, post_hash) VALUES('post', " + toID + ", " + fromID + ", '" + fromName + "', '" + postHash + "')";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(postNotificationSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.getPostNotifications = function(userID, callback) {
  var getPostNotificationsSql = "SELECT * FROM post_notifications WHERE notification_for=" + userID;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getPostNotificationsSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.getMessageNotifications = function(userID, callback) {
  var getPostNotificationsSql = "SELECT * FROM message_notifications WHERE notification_for=" + userID;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getPostNotificationsSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.removeMessageNotifications = function(userID, callback) {
  if(userID) {
    var removeMessageNotificationsSql = "DELETE FROM message_notifications WHERE notification_for=" + userID;
    pool.getConnection(function(err, connection) {
      if(err) {
        callback(true);
        return;
      }
      else {
        connection.query(removeMessageNotificationsSql, function(err, result) {
          connection.release();
          if(err) {
            console.log(err);
            callback(true);
          }
          else {
            callback(false, result);
          }
        })
      }
    })
  }
  else {
    callback(true);
  }
}

exports.removePostNotifications = function(userID, callback) {
  var removePostNotificationsSql = "DELETE FROM post_notifications WHERE notification_for=" + userID;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(removePostNotificationsSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  })
}

exports.addLove = function(lover, loved, callback) {
  // var doesXLoveYSql = "SELECT * FROM lovers WHERE lover='" + x + "' AND loved='" + y +"'";
//   INSERT INTO mytable (ID,`key`,`value`) VALUES (1106,'_views',1)
// ON DUPLICATE KEY UPDATE `value` = `value` + 1;
  var addLoveSql = "INSERT into lovers (lover, loved) VALUES(" + lover + ", " + loved + ");";
  console.log(addLoveSql);
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(addLoveSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  });
}

exports.deleteLove = function(lover, loved, callback) {
  var removeLoveSql = "DELETE FROM lovers WHERE lover=" + lover + " AND loved=" + loved + " LIMIT 1";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(removeLoveSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, result);
        }
      })
    }
  });
}

exports.getLove = function(lover, loved, callback) {
  var getLoveSql = "SELECT * FROM lovers WHERE lover=" + lover + " AND loved=" + loved;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getLoveSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          if(result) {
            callback(false, result.length);
          }
          else {
            callback(false, 0);
          }
        }
      })
    }
  });
}
