const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

var mysql = require("mysql");

var conn = mysql.createConnection({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
});

conn.connect(function (err) {
  if (err) throw err;
  console.log("Connected to " + DB_NAME + " database");
});


module.exports = conn;