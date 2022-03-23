const mysql = require('mysql2');

const connection = mysql.createPool({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DATABASE
});

// --- to check errors
// connection.getConnection(function(err, connection) {
//   console.log(err, connection);
// }); 

module.exports = connection.promise();