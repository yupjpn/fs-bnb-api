var mysqlConn = require("./db");

// DECLARING the class User
var User = function(user) {
    // DELCARING instance variables for class User
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.location = user.location;
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
      var responseUser = {
        id: dbResult.insertId,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        password: newUser.password
    };

    return cb(null, responseUser);
    }

  });
};

User.getUserByEmail = function(userEmail, cb) {
  mysqlConn.query("SELECT * FROM user WHERE email = ?", userEmail, function(err, dbResult) {
    console.log(userEmail);
    if (err) {
      console.log("error: ", err);
      return cb({message: err});
    }
    else {
      console.log(dbResult);

      // dbResult is an array of all the users that fit the criteria
      // if length is 0, this means they haven't registered yet
      if (dbResult.length == 0) {
        console.log("length is 0");
        return cb({message: "Your email doesn't exist in our database. Are you sure you've registered?"});
      }
      else if (dbResult.length == 1) {
        console.log("length is 1");
        return cb(null, dbResult[0]);
      }
      // if array is not 0 or 1, something is messed up
      else {
        return cb({message: "Your email appears to belongs to more than one existing user..."});
      }
    }
  });
};

module.exports = User;