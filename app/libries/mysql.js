const mysql                                  = require('mysql2');
const { mysqlCredentials }                   = require('../../env');
const {host, port, user, password, database} = mysqlCredentials;

const connection = mysql.createConnection({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database
  })

const query = (sql, params) =>
  new Promise((resolve, reject) => {
    connection.query(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

connection.connect(err => {
  if (err) {
    console.error("MySQL connection error:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

module.exports = {
    query
}