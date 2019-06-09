const express = require("express");
const cors = require("cors");

const app = express();

const User = require("./user");
const Owner = require("./owner");
const Property = require("./property");
const Booking = require("./booking");

// why do we have this? do we need to keep this?
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CREATE NEW USER
app.post("/api/users", (req, res) => {
    const user = req.body;
    console.log(user);

    // DECLARING the callback for createUser, which will execute once all the query stuff
    // is done and the callback function in mysqlConn.query is finished
    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        if (err) {
            return res.status(400).json({message: "Error. Could not insert user into database."});
        }
        // if there are no errors:
        return res.status(200).json({user: result});
    };

    // CALLING the function createUser
    User.createUser(user, cb);
});

// PASS IN USER ID AND RETURN USER WITH THAT ID
app.get("/api/users/:id", (req, res) => {
    const userId = req.params.id;

    // checks that query param is an integer
    const numberUsedId = parseInt(userId);
    if (isNaN(numberUsedId)) {
        return res.status(400).json({message: "User ID inputted should be an integer"});
    }
    if (! userId) {
        return res.status(400).json({message: "You did not pass in a user ID"});
    }

    console.log(userId);

    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        if (result.length == 0) {
            return res.status(400).json({message: "User ID does not exist."});            
        }
        else if (result.length == 1) {
            return res.status(200).json({user: result[0]});
        }
    }

    // when getUserById returns, it will 
    User.getUserById(userId, cb);
});

// AUTHENTICATE (LOGIN) USER
app.post("/api/users/authentication", (req, res) => {
    const user = req.body;
    const userEmail = user.email;
    const userPassword = user.password;
    console.log(userEmail);
    console.log(userPassword);

    // DECLARING the callback for getUserByEmail, which will execute once all the query stuff
    // is done and the callback function in mysqlConn.query is finished
    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        if (result.length == 0) {
            return res.status(400).json({message: "Login failed. Are you sure you have registered?"});            
        }
        else if (result.length == 1) {
            // result is an array, so return first element in it
            return res.status(200).json({user: result[0]});
        }
    };

    // CALLING the function getUserByEmail
    // CALL above function cb when User.getUserByEmail function returns 
    User.getUserByEmail(userEmail, userPassword, cb);

});

// CREATE NEW OWNER (aka provider)
app.post("/api/owners", (req, res) => {
    const owner = req.body;
    console.log(owner);

    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        if (err) {
            return res.status(400).json({message: "Error. Could not insert provider into database."});
        }
        // if there are no errors:
        return res.status(200).json({owner: result});
    };

    // CALLING the function createOwner
    Owner.createOwner(owner, cb);
});

// AUTHENTICATE (LOGIN) USER
app.post("/api/owners/authentication", (req, res) => {
    const owner = req.body;
    const ownerEmail = owner.email;
    const ownerPassword = owner.password;
    console.log("Email:");
    console.log(ownerEmail);
    console.log("Password:");
    console.log(ownerPassword);

    // DECLARING the callback for getOwnerByEmail, which will execute once all the query stuff
    // is done and the callback function in mysqlConn.query is finished
    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        if (result.length == 0) {
            return res.status(400).json({message: "Login failed. Are you sure you have registered?"});            
        }
        else if (result.length == 1) {
            // result is an array, so return first element in it
            return res.status(200).json({owner: result[0]});
        }
    };

    // CALLING the function getOwnerByEmail
    // CALL above function cb when Owner.getOwnerByEmail function returns 
    Owner.getOwnerByEmail(ownerEmail, ownerPassword, cb);

});

// CREATE PROPERTY 
app.post("/api/properties", (req, res) => {
    // this is the property that is newProperty in property.js
    const property = req.body;
    console.log("Property received by API:");
    console.log(property);

    // DELCARING the callback for createProperty, which will execute once
    // the query and its callback function is done
    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        if (err) {
            return res.status(400).json({message: "Error. Could not create new property."});
        }
        // if there are no errors:
        return res.status(200).json({property: result});
    };

    Property.createProperty(property, cb);
});

app.post("/api/properties/:id/bookings", (req, res) => {
    const propertyId = req.params.id;
    const booking = req.body;
    booking.property_id = propertyId;
    booking.status = "NEW";

    Booking.createBooking(booking, (err, result) => {
        console.log(err);
        console.log(result);
        return res.status(200).json({id: result});
    });
});

//     const propertyId = req.params.id;
//     const booking = req.body;

// // create new booking request
// app.post("/api/properties/:id/bookings", (req, res) => {
//     // req.body is what we input
//     const propertyId = req.params.id;
//     const booking = req.body;
    
//     // ideally, dateFrom and dateTo should be date objects (ask Miki tomorrow how to do this)
//     const bodyDateFrom = booking.dateFrom;
//     const bodyDateTo = booking.dateTo;
//     const bodyUserId = booking.userId;

//     const numberPropertyId = parseInt(propertyId);
//     if(isNaN(numberPropertyId)) {
//         return res.status(400).json({message: "I am expecting an integer"});
//     }

//     // ultimately, we need to check if user and property whose IDs are above actually exist
//     var errors = [];

//     if (! bodyDateFrom) {
//         errors.push({message: "Invalid date from"});
//     }

//     if (! bodyDateTo) {
//         errors.push({message: "Invalid date to"});
//     }

//     if (! bodyUserId) {
//         errors.push({message: "Invalid user ID"});
//     }

//     if (! propertyId) {
//         errors.push({message: "Invalid property ID"});
//     }

//     if (errors.length > 0) {
//         return res.status(400).json({errorMessages: errors});
//     }

//     bookingCount++;

//     var newBooking = {
//         id: bookingCount,
//         dateFrom: bodyDateFrom,
//         dateTo: bodyDateTo,
//         userId: bodyUserId,
//         propertyId: numberPropertyId,
//         status: "NEW"
//     };

//     if (! bookingsMap.has(numberPropertyId)) {
//         bookingsMap.set(numberPropertyId, new Array());
//     }
    
//     bookingsMap.get(numberPropertyId).push(newBooking);

//     res.json(newBooking);

//     console.log(bookingsMap);
// });

// app.get("/api/properties/:id", (req, res) => {
//     const propertyId = req.params.id;

//     const numberPropertyId = parseInt(propertyId);
//     if(isNaN(numberPropertyId)) {
//         return res.status(400).json({message: "I am expecting an integer"});
//     }

//     if (! propertyId) {
//         return res.status(400).json({message: "Please pass in a propertyId"});
//     }

//     for (var k = 0; k < properties.length; k++) {
//         const aProperty = properties[k];
//         if (aProperty.id == propertyId) {
//             return res.status(200).json(aProperty);
//         }
//     }

//     return res.status(404).json({message: "Property not found"});
// });

// // Get array of bookings from propertyId
// app.get("/api/properties/:id/bookings", (req, res) => {
//     const propertyId = req.params.id;

//     const numberPropertyId = parseInt(propertyId);
//     if(isNaN(numberPropertyId)) {
//         return res.status(400).json({message: "I am expecting an integer"});
//     }

//     if (! propertyId) {
//         return res.status(400).json({message: "Please pass in a propertyId"});
//     }

//     if (bookingsMap.has(numberPropertyId)) {
//         return res.status(200).json(bookingsMap.get(numberPropertyId));
//     }
//     else {
//         return res.status(404).json({message: "Property not found"});
//     }
// });

// app.delete("/api/properties/:id", (req, res) => {
//     const propertyId = req.params.id;

//     const numberPropertyId = parseInt(propertyId);
//     if(isNaN(numberPropertyId)) {
//         return res.status(400).json({message: "I am expecting an integer"});
//     }

//     if (!propertyId) {
//         return res.status(400).json({message: "Please pass in a propertyId"});
//     }

//     foundProperty = false;
//     // loop through properties, remove if id is the same
//     for (var k = 0; k < properties.length; k++) {
//         const aProperty = properties[k];
//         if (aProperty.id == propertyId) {
//             // remove property at index k, we are removing 1 property
//             properties.splice(k, 1);
//             foundProperty = true;
//             // if found, break out of for loop
//             break;
//         }
//     }

//     console.log(properties);


//     if (foundProperty == true) {
//         return res.status(200).json({message: "Property deleted"});
//     }
//     else {
//         return res.status(404).json({message: "Property not found"});
//     }

// });

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));