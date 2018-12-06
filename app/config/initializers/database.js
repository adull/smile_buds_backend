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
    password: '',
    host: 'localhost',
    port: '3306',
    database: 'smile_buds'
  });
}

console.log("pool");
console.log(pool);

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

exports.editProfileHobby = function(hobby, identifier, callback) {
  hobbySql = "UPDATE user SET hobby='" + hobby +"' WHERE identifier='" + identifier + "'"
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    else {
      connection.query(hobbySql, function(err, result) {
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

exports.editProfilePassword = function(password, identifier, callback) {
  passwordSql = "UPDATE user SET password='" + password +"' WHERE identifier='" + identifier + "'"
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    else {
      connection.query(passwordSql, function(err, result) {
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

exports.editProfileEmailNotifications = function(emailNotifications, identifier, callback) {
  emailNotifSql = "UPDATE user SET email_notifications='" + emailNotifications +"' WHERE identifier='" + identifier + "'"
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    else {
      connection.query(emailNotifSql, function(err, result) {
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
  if(searchBy === 'userid') {
    var getUserSql = "SELECT id, identifier, first_name, hobby, type FROM user WHERE id='" + value + "';";
  }
  if(searchBy === 'identifier') {
    var getUserSql = "SELECT id, identifier, first_name, hobby, type FROM user WHERE identifier='" + value + "';";
  }

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
        return;
      })
    }
  })
}

exports.getUserWithEmail = function(value, callback) {
  var getUserSql = "SELECT * FROM user WHERE email='" + value + "';";

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
        callback(false, userResult);
        return;
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
          return;
        }
        else {
          callback(false, result);
          return;
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
    else {
      connection.query(getPostSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
          return;
        }
        else {
          callback(false, result);
          return;
        }
      })
    }
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
          return;
        }
        else {
          callback(false, result);
          return;
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
          return;
        }
        else {
          // console.log(result);
          callback(false, result);
          return;
        }
      })
    }
  });
}

exports.getGrins = function(hash, callback) {
  let getGrinnersSql = "SELECT user_id, user_name, user_identifier FROM post_grins WHERE post_hash='" + hash + "' ORDER BY id DESC";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getGrinnersSql, function(err, result) {
        connection.release();
        if(err) {
          callback(true);
          console.log(err);
          return;
        }
        else {
          callback(false, result);
          return;
        }
      })
    }
  })
}

exports.doesPostGrinExist = function(hash, userid, callback) {
  let doesGrinExistSql = "SELECT * FROM post_grins WHERE post_hash='" + hash + "' AND user_id=" + userid;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(doesGrinExistSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
          return;
        }
        else {
          callback(false, result);
          return;
        }
      })
    }
  })
}

exports.grinAtPost = function(hash, userid, userName, userIdentifier, callback) {
  if(userid) {
    let grinAtSql = "INSERT IGNORE INTO post_grins (post_hash, user_id, user_name, user_identifier) VALUES('" + hash + "', " + userid + ", '" + userName + "', '" + userIdentifier + "')";
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
            return;
          }
          else {
            callback(false, result);
            return;
          }
        })
      }
    })
  }
  else {
    callback(true);
  }
}

exports.ungrinAtPost = function(hash, userid, callback) {
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
          return;
        }
        else {
          callback(false, result);
          return;
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
          return;
        }
        else {
          callback(false, result);
          return;
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
            return;
          }
          else {
            callback(false, result);
            return;
          }
        })
      }
    })
  }
  else {
    callback(true);
    return;
  }
}

exports.getAllMessages = function(userid, callback) {
  var getMessageBuddiesSql = "SELECT * FROM messages WHERE (recipient=" + userid + " OR sender=" + userid + ") ORDER BY id DESC";
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
          callback(false, result);
        }
      })
    }
  })
}

exports.getMessages = function(userid, messaging, callback) {
  if(userid && messaging) {
    var getMessageBuddiesSql = "SELECT * FROM messages WHERE (recipient=" + userid + " AND sender=" + messaging + ") OR (recipient=" + messaging + " AND sender=" +userid + ") ORDER BY id DESC";
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

exports.commentNotifications = function(commentNotificationArr, callback) {
  let toNotify = 0;
  if(commentNotificationArr.length > 0) {
    var commentNotificationsSql = 'INSERT INTO comment_notifications (notification_type, notification_for, notification_from_id, notification_from_name, post_hash) VALUES';
    for(var i = 0; i < commentNotificationArr.length; i ++) {
      let c = commentNotificationArr[i]
      if(c.notification_for === c.notification_from_id) {

      }
      else {
        tempCommentNotifSql = "('comment', " + c.notification_for + ", " + c.notification_from_id + ", '" + c.notification_from_name + "'," + "'" + c.post_hash + "'),"
        commentNotificationsSql = commentNotificationsSql.concat(tempCommentNotifSql);

        toNotify++;
      }
    }
    if(toNotify === 0) {
      callback(false, "lol");
      return;
    }
    else {
      var commentNotificationsSql = commentNotificationsSql.replace(/.$/,";")
      pool.getConnection(function(err, connection) {
        if(err) {
          callback(true);
          return;
        }
        else {
          connection.query(commentNotificationsSql, function(err, result) {
            connection.release();
            if(err) {
              console.log(err);
              callback(true);
              return;
            }
            else {
              callback(false, "lol");
            }
          })
        }
      })
    }
  }
  else {
    callback(true)
  }
};

exports.messageNotification = function(toID, fromID, fromName, callback) {
  if(toID !== fromID) {
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
}

exports.postNotification = function(toID, fromID, fromName, postHash, callback) {
  if(toID !== fromID) {
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
    callback(false, "haha")
  }
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
  var getMessageNotificationsSql = "SELECT * FROM message_notifications WHERE notification_for=" + userID;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getMessageNotificationsSql, function(err, result) {
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

exports.getCommentNotifications = function(userID, callback) {
  var getCommentNotificationsSql = "SELECT * FROM comment_notifications WHERE notification_for=" + userID;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getCommentNotificationsSql, function(err, result) {
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

exports.removeMessageNotification= function(myID, theirID, callback) {
  var removeMessageNotificationSql = "DELETE FROM message_notifications WHERE (notification_for=" + myID + " AND notification_from_id=" + theirID + ") OR (notification_for=" + theirID + " AND notification_from_id=" + myID + ")";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(removeMessageNotificationSql, function(err, result) {
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

//the difference between this and removegrinnotification is that it uses the recipient's id
exports.removePostNotification= function(userID, hash, callback) {
  var removePostNotificationSql = "DELETE FROM post_notifications WHERE notification_for=" + userID + " AND post_hash='" + hash + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(removePostNotificationSql, function(err, result) {
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

exports.removeCommentNotification= function(userID, hash, callback) {
  var removePostNotificationSql = "DELETE FROM comment_notifications WHERE notification_for=" + userID + " AND post_hash='" + hash + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(removePostNotificationSql, function(err, result) {
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



//the difference between this and removepostnotification is that it uses the sender's id
exports.removeGrinNotification = function(userID, hash, callback) {
  var removePostNotificationSql = "DELETE FROM post_notifications WHERE notification_from_id=" + userID + " AND post_hash='" + hash + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(removePostNotificationSql, function(err, result) {
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
  var addLoveSql = "INSERT into lovers (lover, loved) VALUES(" + lover + ", " + loved + ");";
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

exports.getComments = function(hash, callback) {
  var getCommentsSql = "SELECT * FROM comments WHERE post_hash='" + hash + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getCommentsSql, function(err, results) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          if(results) {
            callback(false, results);
          }
        }
      })
    }
  })
}

exports.writeComment = function(comment, callback) {
  var writeCommentSql = "INSERT INTO comments SET ?";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(writeCommentSql, comment, function(err, result) {
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

exports.getComment = function(commentID, callback) {
  var getCommentSql = "SELECT * FROM comments WHERE id=" + commentID
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getCommentSql, function(err, result) {
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

exports.deleteComment = function(commentID, callback) {
  var deleteCommentSql = "DELETE FROM comments WHERE id=" + commentID;
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(deleteCommentSql, function(err, results) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, results);
        }
      })
    }
  })
}

exports.getCommenters = function(hash, callback) {
  var users = [];
  var getCommentersSql = "SELECT commenter_id FROM comments WHERE post_hash='" + hash + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getCommentersSql, function(err, results) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, results);
        }
      })
    }
  })
}


exports.deletePost = function(hash, callback) {
  var deletePostSql = "DELETE FROM post WHERE hash = '" + hash + "';";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(deletePostSql, function(err, result) {
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

exports.deleteUser = function(identifier, callback) {
  var deleteUserSql = "DELETE FROM user WHERE identifier = '" + identifier + "';";
  // console.log(deleteUserSql);
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(deleteUserSql, function(err, result) {
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

exports.deleteUserComments = function(identifier, callback) {
  var deleteUserCommentsSql = "DELETE FROM comments WHERE commenter_identifier = '" + identifier + "';";
  // console.log(deleteUserCommentsSql);
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(deleteUserCommentsSql, function(err, result) {
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

exports.deleteUserPosts = function(id, callback) {
  var deleteUserPostsSql = "DELETE FROM post WHERE poster_id = " + id + ";";
  // console.log(deleteUserPostsSql)
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(deleteUserPostsSql, function(err, result) {
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

exports.deleteUserMessages = function(id, callback) {
  var deleteUserMessagesSql = "DELETE FROM messages WHERE (sender = " + id + ") OR (recipient = " + id + ");";
  // console.log(deleteUserMessagesSql)
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(deleteUserMessagesSql, function(err, result) {
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

exports.deleteUserGrins = function(identifier, callback) {
  var deleteUserGrinsSql = "DELETE FROM post_grins WHERE user_identifier = '"+ identifier + "'";
  // console.log(deleteUserGrinsSql)
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(deleteUserGrinsSql, function(err, result) {
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

exports.getSpecificPosts = function(posts, callback) {
  // console.log(posts);
  var getSpecificPostsSql = 'SELECT * FROM post WHERE'
  var whereClause = '';
  if(posts.length > 0) {
    for(var i = 0; i < posts.length; i ++) {
      whereClause += " hash='" + posts[i] + "'";
      if(i < posts.length - 1) {
        whereClause += " OR"
      }
    }
    getSpecificPostsSql += whereClause;
    pool.getConnection(function(err, connection) {
      if(err) {
        callback(true);
        return;
      }
      else {
        connection.query(getSpecificPostsSql, function(err, result) {
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


exports.searchUserLike = function(searchQuery, callback) {
  var searchUserLikeSql = "SELECT * FROM user WHERE first_name LIKE '%" + searchQuery + "%'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(searchUserLikeSql, function(err, results) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, results);
        }
      })
    }
  })
}

exports.doesCommentGrinExist = function(commentID, grinnerIdentifier, callback) {
  let doesGrinExistSql = "SELECT * FROM comment_grins WHERE comment_id=" + commentID + " AND grinner_identifier='" + grinnerIdentifier + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(doesGrinExistSql, function(err, result) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
          return;
        }
        else {
          callback(false, result);
          return;
        }
      })
    }
  })
}

exports.ungrinAtComment = function(commentID, grinnerIdentifier, callback) {
  let ungrinAtCommentSql = "DELETE FROM comment_grins WHERE comment_id=" + commentID + " AND grinner_identifier='" + grinnerIdentifier + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(ungrinAtCommentSql, function(err, results) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, results);
        }
      })
    }
  })
}

exports.grinAtComment = function(commentID, grinnerIdentifier, grinnerName, callback) {
  var grinAtCommentSql = "INSERT IGNORE INTO comment_grins (comment_id, grinner_identifier, grinner_name) VALUES(" + commentID + ", '" + grinnerIdentifier + "', '" + grinnerName + "' )"
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(grinAtCommentSql, function(err, results) {
        connection.release();
        if(err) {
          console.log(err);
          callback(true);
        }
        else {
          callback(false, results);
        }
      })
    }
  })
}

exports.getCommentGrins = function(commentArr, callback) {
  var getCommentGrinsSql = 'SELECT * FROM comment_grins WHERE'
  var whereClause = '';
  if(commentArr.length > 0) {
    for(var i = 0; i < commentArr.length; i ++) {
      whereClause += " comment_id='" + commentArr[i].id + "'";
      if(i < commentArr.length - 1) {
        whereClause += " OR"
      }
    }
    getCommentGrinsSql += whereClause
    pool.getConnection(function(err, connection) {
      if(err) {
        callback(true);
        return;
      }
      else {
        connection.query(getCommentGrinsSql, function(err, results) {
          connection.release();
          if(err) {
            callback(true);
          }
          else {
            callback(false, results);
          }
        })
      }
    })
  }
  else {
    callback(false, []);
  }
}

exports.doesFeedExist = function(newFeedName, callback) {
  var doesFeedExistSql = "SELECT * FROM feeds WHERE feed_name='" + newFeedName + "';";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(doesFeedExistSql, function(err, result) {
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

exports.newFeed = function(newFeedData, callback) {
  var newFeedSql = "INSERT INTO feeds SET ?";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(newFeedSql, newFeedData, function(err, result) {
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

exports.getUserFeeds = function(callback) {
  var getUserFeedsSql = "SELECT * FROM feeds";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getUserFeedsSql, function(err, result) {
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

exports.getUserFeedPosts = function(feedName, postsReceived, callback) {
  var getUserFeedPostsSql = "SELECT * FROM post WHERE feed_name='" + feedName + "' ORDER BY id DESC LIMIT " + postsReceived + ", 10";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getUserFeedPostsSql, function(err, result) {
        connection.release();
        if(err) {
          callback(true);
          return;
        }
        else {
          // console.log(result);
          callback(false, result);
          return;
        }
      })
    }
  });
}

exports.getUserFeed = function(feedName, callback) {
  var getUserFeedSql = "SELECT * FROM feeds WHERE feed_name='" + feedName + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      callback(true);
      return;
    }
    else {
      connection.query(getUserFeedSql, function(err, result) {
        connection.release();
        if(err) {
          callback(true);
          return;
        }
        else {
          callback(false, result);
          return;
        }
      })
    }
  });
}

exports.editUserFeed = function(updateBody, feedProperty, feedName, callback) {
  // var updatedDescription = updateBody.description;
  var updatedValue;
  if(feedProperty === 'name') {
    updatedValue = updateBody.name;
  }
  else if(feedProperty === 'description') {
    updatedValue = updateBody.description;
  }
  else if(feedProperty === 'image') {
    updatedValue = updateBody.image;
  }
  else {
    console.log("invalid feedProperty - line 1389. Current input for feedProperty is " + feedProperty);
    res.end();
    return;
  }
  var editUserFeedSql = "UPDATE feeds SET " + feedProperty + "='" + updatedValue +"' WHERE feed_name='" + feedName + "'";
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    else {
      connection.query(editUserFeedSql, function(err, result) {
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
