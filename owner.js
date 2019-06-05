var mysqlConn = require("./db");

var Owner = function(owner) {
    this.firstname = owner.firstname;
    this.lastname = owner.lastname;
    this.location = owner.location;
    this.join_year = owner.join_year;
    this.email = owner.email;
    this.phonenumber = owner.email;
};

Owner.createOwner = function(newOwner, result) {
  mysqlConn.query("INSERT INTO owner set ?", newOwner, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};

module.exports = Owner;