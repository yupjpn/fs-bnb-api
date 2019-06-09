var mysqlConn = require("./db");

var Booking = function(booking) {
    this.user_id = booking.user_id;
    this.proeprty_id = booking.property_id;
    this.date_from = booking.date_from;
    this.date_to = booking.date_to;   
    // this.status = "NEW";
    // property ID is from URL and id is auto increment
};

// DECLARING THE FUNCTION createUser
Booking.createBooking = function(newBooking, cb) {
  // the below function is createUser (this function will call cb once newUser is created)
  // Within createUser, we query the database
  // Once we try quering the database and the database answers, it supplies us the
  // necessary arguments (in err and dbResult) for us to call the callback function below
  mysqlConn.query("INSERT INTO booking set ?", newBooking, function(err, dbResult) {
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
      let responseBooking = {
        id: dbResult.insertId,
        user_id: newBooking.user_id,
        property_id: newBooking.property_id,
        date_from: newBooking.date_from,
        date_to: newBooking.date_to
    };

    return cb(null, responseBooking);
    }

  });
};

Booking.getBookingsByPropertyId = function(propertyId, cb) {
  mysqlConn.query("SELECT * FROM booking WHERE property_id = ?", [propertyId], function(err, dbResult) {
    console.log(propertyId);

    if (err) {
      console.log("error: ", err);
      return cb({message: err});
    }
    // return entire array where property ID matches
    else {
      console.log(dbResult);
      return cb(null, dbResult);
    }
  });
};

module.exports = Booking;