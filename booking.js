var mysqlConn = require("./db");

var Booking = function(booking) {
    this.user_id = booking.user_id;
    this.date_from = booking.date_from;
    this.date_to = booking.date_to;   
    // this.status = "NEW";
    // property ID is from URL and id is auto increment
};

Booking.createBooking = function(newBooking, result) {
  mysqlConn.query("INSERT INTO booking set ?", newBooking, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};

module.exports = Booking;