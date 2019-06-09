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
    const numberUserId = parseInt(userId);
    if (isNaN(numberUserId)) {
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

// GET ALL PROPERTIES (AKA LISTINGS/RENTALS)
app.get("/api/properties/", (req, res) => {

    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        // returns an array of rentals 
        return res.status(200).json({rentals: result});
    }

    Property.getAllProperties(cb);
});

// PASS IN OWNER ID AND RETURN ARRAY OF RENTALS MATCHING OWNER ID
app.get("/api/properties/ownerId/:ownerId/", (req, res) => {
    const ownerId = req.params.ownerId;

    // checks that query param is an integer
    const numberOwnerId = parseInt(ownerId);
    if (isNaN(numberOwnerId)) {
        return res.status(400).json({message: "Invalid owner ID"});
    }
    if (! ownerId) {
        return res.status(400).json({message: "Owner ID was not passed in"});
    }

    console.log(ownerId);

    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        // returns an array of rentals matching the owner ID
        return res.status(200).json({rentals: result});
    }

    Property.getPropertiesByOwnerId(numberOwnerId, cb);
});

app.get("/api/properties/propertyId/:propertyId", (req, res) => {
    const propertyId = req.params.propertyId;

    // checks that query param is an integer
    const numberPropertyId = parseInt(propertyId);
    if (isNaN(numberPropertyId)) {
        return res.status(400).json({message: "Invalid property ID"});
    }
    if (! propertyId) {
        return res.status(400).json({message: "Property ID was not passed in"});
    }

    console.log(propertyId);

    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        // returns an array of rentals matching the owner ID
        return res.status(200).json({rental: result});
    }

    Property.getPropertiesById(numberPropertyId, cb);
});

// CREATE NEW BOOKING
app.post("/api/bookings", (req, res) => {
    const booking = req.body;
    console.log(booking);

    // DECLARING the callback for createUser, which will execute once all the query stuff
    // is done and the callback function in mysqlConn.query is finished
    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        if (err) {
            return res.status(400).json({message: "Error. Could not insert booking into database."});
        }
        // if there are no errors:
        return res.status(200).json({booking: result});
    };

    // CALLING the function createUser
    Booking.createBooking(booking, cb);
});

app.get("/api/bookings/:propertyId", (req, res) => {
    const propertyId = req.params.propertyId;

    // checks that query param is an integer
    const numberPropertyId = parseInt(propertyId);
    if (isNaN(numberPropertyId)) {
        return res.status(400).json({message: "Invalid property ID"});
    }
    if (! propertyId) {
        return res.status(400).json({message: "Property ID was not passed in"});
    }

    console.log(propertyId);

    let cb = (err, result) => {
        console.log(err);
        console.log(result);

        // returns an array of rentals matching the owner ID
        return res.status(200).json({bookings: result});
    }

    Booking.getBookingsByPropertyId(numberPropertyId, cb);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));