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

Property.getAllProperties = function(cb) {
  mysqlConn.query("SELECT * FROM property", function(err, dbResult) {

    if (err) {
      console.log("error: ", err);
      return cb({message: err});
    }
    else {
      // result is an array of all properties
      console.log(dbResult);
      return cb(null, dbResult);
    }
  });
};

Property.getPropertiesByOwnerId = function(ownerId, cb) {
  mysqlConn.query("SELECT * FROM property WHERE owner_id = ?", [ownerId], function(err, dbResult) {
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

Property.getPropertiesById = function(propertyId, cb) {
  mysqlConn.query("SELECT * FROM property WHERE id = ?", [propertyId], function(err, dbResult) {
    console.log(propertyId);

    if (err) {
      console.log("error: ", err);
      return cb({message: err});
    }
    // Should only be one property, so dbResult should be of length 1
    // Return first element in that array, not the array itself
    else {
      console.log(dbResult);
      return cb(null, dbResult[0]);
    }
  });
};

Property.deleteProperty = function(propertyId, cb) {
  mysqlConn.query("DELETE FROM property WHERE id = ?", [propertyId], function(err, dbResult) {
    console.log(propertyId);

    if (err) {
      console.log("error: ", err);
      return cb({message: err});
    }
    else {
      // dbResult doesn't really mean anything here - it's just the number
      // of rows affected
      console.log(dbResult);
      let successMessage = "Property successfully deleted!"
      return cb(null, successMessage);
    }
  });
};

Property.updateProperty = function(newProperty, cb) {
  mysqlConn.query("UPDATE property SET name = ?, location =?, imageLink = ?, price = ? WHERE id = ?", [newProperty.name, newProperty.location, newProperty.imageLink, newProperty.price, newProperty.id], function(err, dbResult) {
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