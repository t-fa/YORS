const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs340_fattaht',
  password: 'zashox-meXcav-0winva',
  database: 'cs340_fattaht',
});

module.exports.pool = pool;
