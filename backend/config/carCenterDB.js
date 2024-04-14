const mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "carCenter",
  port: "3007", // only on noni device
});

module.exports = connection;
