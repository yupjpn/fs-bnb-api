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
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, res.insertId);
    }
  });
};

module.exports = Property;