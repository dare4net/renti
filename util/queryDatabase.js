const mysql = require('mysql2');

// Database query function
function queryDatabase(query, params = [], db='renti') {
    const connectionConfig = {
        host: process.env.MYSQL_HOSTNAME,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT,
        database: db,
    };

    return new Promise((resolve, reject) => {
        // Create connection
        const connection = mysql.createConnection(connectionConfig);
        console.log("Connected to mysql server");

        // Connect to the database
        connection.connect((err) => {
            if (err) {
                console.error('Database connection error:', err);
                return reject(err);
            }

            // Execute query
            connection.query(query, params, (error, results) => {
                // Close connection
                console.log("Closing Connection to mysql server");
                connection.end();

                if (error) {
                    console.error('Query execution error:', error);
                    return reject(error);
                }

                resolve(results); // Return query results
            });
        });
    });
}

module.exports = queryDatabase;
