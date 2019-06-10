let mysqlConn = require("./db");

let Owner = function(owner) {
    this.firstName = owner.firstName;
    this.lastName = owner.lastName;
    this.email = owner.email;
    this.password = owner.password;
  };

Owner.createOwner = function(newOwner, cb) {
  mysqlConn.query("INSERT INTO owner set ?", newOwner, function(err, dbResult) {
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

      // owner to send back to client
      let responseOwner = {
        id: dbResult.insertId,
        firstname: newOwner.firstName,
        lastname: newOwner.lastName,
        email: newOwner.email,
        password: newOwner.password
    };

    return cb(null, responseOwner);
    }

  });
};

Owner.getOwnerByEmail = function(ownerEmail, ownerPassword, cb) {
  mysqlConn.query("SELECT * FROM owner WHERE email = ? and password = ?", [ownerEmail, ownerPassword], function(err, dbResult) {
    console.log("Email:");    
    console.log(ownerEmail);
    console.log("Password:");    
    console.log(ownerPassword);

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

Owner.getOwnerById = function(ownerId, cb) {
  mysqlConn.query("SELECT * FROM owner WHERE id = ?", [ownerId], function(err, dbResult) {
    console.log(ownerId);

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

module.exports = Owner;