const mysql = require('mysql');

var pool = mysql.createPool({
  user: 'root',
  password: 'root',
  host: 'localhost',
  port: '8889',
  database: 'smile_buds'
  // socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

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
  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err)
      callback(true);
      return;
    }
    connection.query(getUserSql, function(err, userResult) {
      connection.release();
      if(err) {
        console.log(err);
        callback(true);
        return;
      }
      callback(false, userResult);
    })
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

exports.getPosts = function(id, postsReceived, callback) {
  var getPostsSql = "";
  if(id === "all") {
    getPostsSql = "SELECT * FROM post ORDER BY id DESC LIMIT 10";
  }
  else {
    getPostsSql = "SELECT * FROM post WHERE poster_id='" + id + "' ORDER BY id DESC LIMIT 10";
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
  let grinAtSql = "INSERT INTO post_grins (post_hash, user_id, user_name) VALUES('" + hash + "', " + userid + ", '" + userName + "')";
  console.log(grinAtSql);
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
          callback(false, result);
        }
      })
    }
  })
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
