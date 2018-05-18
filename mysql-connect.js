const mysql = require('mysql');
const logger = require('./logger');

let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'tiger',
    database: 'school',
    debug: false
});

let sql = async function(query, params){
    let data = await new Promise(function(resolve, reject){
        pool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(query, params, function (error, results, fields) {
                // And done with the connection.
                connection.release();
        
                // Handle error after the release.
                if (error) logger.error(error);
                
                // Don't use the connection here, it has been returned to the pool.
                resolve(results)
            });
    
        });
    })

    return data;
}

module.exports = sql;
