var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : '[hostname here...]',
  user            : '[username here...]',
  password        : '[password here...]',
  database        : '[db name here....]'
});

module.exports.pool = pool;
