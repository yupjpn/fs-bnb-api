var mysqlConn = require("./db");

var Property = function(property) {
    this.property_name = property.property_name;
    this.owner_id = property.owner_id;
    this.location = property.location;
    this.image_link = property.image_link;
    this.price = property.price;
};

Property.createProperty = function(newProperty, result) {
  mysqlConn.query("INSERT INTO property set ?", newProperty, function(err, res) {
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

        property_name: newProperty.property_name,
        owner_id: newProperty.owner_id,
        location: newProperty.location,
        image_link: newProperty.image_link,
        price: newProperty.price
    };

    return cb(null, responseUser);
    }
  });
};

module.exports = Property;