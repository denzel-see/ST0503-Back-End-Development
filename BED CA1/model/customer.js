// DAAA1B07 Denzel See P2222840
var db = require('./databaseConfig.js');

module.exports = {

    addCustomer: function (store_id, first_name, last_name, email, address_line1, address_line2, district, city_id, postal_code, phone, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (address_line1.length == 0 || district.length == 0 || city_id.length == 0 || postal_code.length == 0|| store_id.length == 0||first_name.length ==0||last_name.length == 0){
                nullTrue = true
            }
            if(address_line1 == undefined ||address_line2 == undefined|| district == undefined || city_id == undefined || postal_code == undefined || store_id == undefined||first_name ==undefined||last_name == undefined){
                undefinedTrue = true
            }
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                
                console.log("Connected to bed_dvd_db db in sakila.js addCustomer function");
                const getAddressID = 'SELECT address.address_id,email FROM customer,address ORDER BY address_id DESC'
                conn.query(getAddressID, function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        const addAddress = 'INSERT INTO address(address.address,address2,district,city_id,postal_code,phone) VALUES(?,?,?,?,?,?)'
                        conn.query(addAddress, [address_line1, address_line2, district, city_id, postal_code, phone], function (error, resultA) {
                            if (error) {
                                console.log(error)
                                return callback(error, null)
                            } else {
                                var address_id = resultA.insertId
                                var sql = 'INSERT INTO customer(store_id,first_name,last_name,email,address_id) VALUES(?,?,?,?,?)';
                                conn.query(sql, [store_id, first_name, last_name, email, address_id], function (errors, results) {
                                    if (errors) {
                                        for(j=0;j<result.length;j++){
                                            if(email==result[j].email){
                                                unique=false
                                            }
                                        }
                                        console.log(errors);
                                        return callback(errors, null)
                                    } else {
                                        return callback(null,results.insertId)
                                    }
                                })
                            }
                        })
                    }
                });
            }
        });
    },

    updateAddress: function (customer_id, address, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection gt issue!
                console.log(err);
                return callback(err, null);
            } else {
                const getAddressQuery = `SELECT address_id, district, city_id FROM address WHERE address_id IN (SELECT address_id FROM customer WHERE customer_id = ?)`;
                dbConn.query(getAddressQuery, [customer_id], (error, results) => {
                    if (error) {
                        return callback(error, null);
                    } else {
                        var address_id = results[0].address_id
                        var {address_line1,district,city_id,postal_code} = address
                        if(district == undefined) district = results[0].district
                        if(city_id == undefined) city_id = results[0].city_id
                        if(city_id >600) cityidFalse=true
                        const editActorQuery = `UPDATE address SET address = ?, district = ? , city_id = ? , postal_code = ? WHERE address_id = ?`
                        dbConn.query(editActorQuery, [address_line1,district,city_id,postal_code,address_id])
                        return callback(null, results);
                    }
                });
            }
        });
    },
}
