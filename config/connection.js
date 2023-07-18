// requires the mysql2 for futher use.
const mysql = require('mysql2');

// dotenv package to retrieve secured information to access db.
require('dotenv').config();

// connect function for db to the server.js
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = connection;