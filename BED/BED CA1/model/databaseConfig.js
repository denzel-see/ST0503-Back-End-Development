// DAAA1B07 Denzel See P2222840
var mysql = require('mysql');
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "bed_dvd_root",
            password: "pa$$woRD123", 
            database: "bed_dvd_db",
            dataStrings: true,
            dateStrings: true
        });     
        return conn;
    }
};
module.exports = dbconnect
