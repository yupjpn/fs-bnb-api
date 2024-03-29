let mysqlConn = require("./db");

// DECLARING the class User
// user is passed in
let User = function(user) {
    // DELCARING instance variables for class User
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
};

// DECLARING THE FUNCTION createUser
User.createUser = function(newUser, cb) {
  // the below function is createUser (this function will call cb once newUser is created)
  // Within createUser, we query the database
  // Once we try quering the database and the database answers, it supplies us the
  // necessary arguments (in err and dbResult) for us to call the callback function below
  mysqlConn.query("INSERT INTO user set ?", newUser, function(err, dbResult) {
    // if its an error
    if (err) {
      console.log("error: ", err);

      if (err.code === "ER_DUP_ENTRY") {
        //return res.status(400).json({message: err.sqlMessage});
        return cb({message: err.sqlMessage});
      }
      else {
        //return res.status(500).json({message: "Failed to insert"});
        return cb({message: "Failed to insert"});
      }
    } 
    // if not an error
    else {
      console.log(dbResult);

      // user to send back to client
      let responseUser = {
        id: dbResult.insertId,
        firstname: newUser.firstName,
        lastname: newUser.lastName,
        email: newUser.email,
        password: newUser.password
    };

    return cb(null, responseUser);
    }

  });
};

User.getUserByEmail = function(userEmail, userPassword, cb) {
  mysqlConn.query("SELECT * FROM user WHERE email = ? and password = ?", [userEmail, userPassword], function(err, dbResult) {
    console.log(userEmail);
    console.log(userPassword);

    if (err) {
      console.log("error: ", err);
      return cb({message: err});
    }
    else {
      console.log(dbResult);
      return cb(null, dbResult);
    }
  });
};

User.getUserById = function(userId, cb) {
  mysqlConn.query("SELECT * FROM user WHERE id = ?", [userId], function(err, dbResult) {
    console.log(userId);

    if (err) {
      console.log("error: ", err);
      return cb({message: err});
    }
    else {
      console.log(dbResult);
      return cb(null, dbResult);
    }
  });
};

module.exports = User;