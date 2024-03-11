const mysql = require('mysql');
let connection;

try {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'quesos'
    });
} catch (error) {
    console.log("Error al conectar con la base de datos");
}

module.exports = {connection};