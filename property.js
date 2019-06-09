var mysqlConn = require("./db");

var Property = function(property) {
    this.name = property.name;
    this.owner_id = property.owner_id;
    this.location = property.location;
    this.imageLink = property.imageLink;
    this.price = property.price;
};

Property.createProperty = function(newProperty, cb) {
  mysqlConn.query("INSERT INTO property set ?", newProperty, function(err, dbResult) {
    if (err) {
      console.log("error: ", err);

      if (err.code === "ER_DUP_ENTRY") {
        return cb({message: err.sqlMessage});
      }
      else {
        return cb({message: "Failed to insert"});
      }
    } 
    // if not an error
    else {
      console.log(dbResult);

      // property to send back to client
      let responseProperty = {
        id: dbResult.insertId,
        name: newProperty.name,
        owner_id: newProperty.owner_id,
        location: newProperty.location,
        imageLink: newProperty.imageLink,
        price: newProperty.price
    };

    return cb(null, responseProperty);
    }
  });
};

module.exports = Property;