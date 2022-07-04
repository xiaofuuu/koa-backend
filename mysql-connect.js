const mysql = require('mysql');
var log = require('log4js').getLogger("app");

let pool = mysql.createPool({
  host: '',
  user: '', // root
  password: '', // 12345678
  database: '',
  debug: false,
  port: '3306'
});

let sql = async function (query, params) {
  let data = await new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {

      if (err) {
        reject(err);
        log.error(err);
      }

      // Use the connection
      connection.query(query, params, function (error, results, fields) {
        // And done with the connection.
        connection.release();

        // Handle error after the release.
        if (error) {
          reject(error);
          log.error(error);
        }

        // Don't use the connection here, it has been returned to the pool.
        resolve(results);
      });

    });
  });

  return data;
};

module.exports = sql;
