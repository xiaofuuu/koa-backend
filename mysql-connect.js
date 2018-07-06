const mysql = require('mysql');
const logger = require('./logger');

let pool = mysql.createPool({
    host: 'localhost',
    user: 'guest',
    password: 'guest123',
    database: 'my_local_db',
    debug: false
});

let sql = async function(query, params){
    let data = await new Promise(function(resolve, reject){
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
                resolve(results)
            });
    
        });
    })

    return data;
}

module.exports = sql;
