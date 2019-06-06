var mysqlConn = require("./db");

var Owner = function(owner) {
    this.firstname = owner.firstname;
    this.lastname = owner.lastname;
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
      var responseOwner = {
        id: dbResult.insertId,
        firstname: newOwner.firstname,
        lastname: newOwner.lastname,
        email: newOwner.email,
        password: newOwner.password
    };

    return cb(null, responseOwner);
    }

  });
};

module.exports = Owner;