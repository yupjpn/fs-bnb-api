var mysqlConn = require("./db");

var User = function(user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.location = user.location;
    this.join_year = user.join_year;
    this.email = user.email;
};

User.createUser = function(newUser, result) {
  mysqlConn.query("INSERT INTO user set ?", newUser, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};



module.exports = User;