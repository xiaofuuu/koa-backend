const mysql = require('mysql');
const logger = require('./logger');

let pool = mysql.createPool({
  host: '47.93.156.147',
  user: 'www', // root
  password: 'Koalareading123', // 12345678
  database: 'summit',
  debug: false,
  port: '4406'
});

let sql = async function (query, params) {
  let data = await new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {

      if (err) {
        reject(err);
        logger.error(err);
      }

      // Use the connection
      connection.query(query, params, function (error, results, fields) {
        // And done with the connection.
        connection.release();

        // Handle error after the release.
        if (error) {
          reject(error);
          logger.error(error);
        }

        // Don't use the connection here, it has been returned to the pool.
        resolve(results);
      });

    });
  });

  return data;
};

module.exports = sql;
