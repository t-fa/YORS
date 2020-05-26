const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_andejane',
  password        : 'W9ozSMaBwJE80zOO',
  database        : 'cs340_andejane',
});

module.exports.pool = pool;
