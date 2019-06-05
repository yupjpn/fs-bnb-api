const mysql = require("mysql");

const config = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "fs_bnb"
};

var connection = mysql.createConnection(config);
connection.connect();

module.exports = connection;