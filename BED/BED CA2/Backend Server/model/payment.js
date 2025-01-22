// DAAA1B07 Denzel See P2222840
var db = require('./databaseConfig.js');

module.exports = {
    getCustomer: function (customer_id, start_date, end_date, callback) { // usually used by a single user to get own record
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                // console.log("Connected!"); // NOT useful
                console.log("Connected to bed_dvd_db db in sakila.js getCustomer function");
                var sql = `SELECT amount, payment_date FROM payment WHERE customer_id IN (SELECT customer_id FROM customer WHERE customer_id=?) AND payment_date BETWEEN ? AND ?  `;

                conn.query(sql, [customer_id, start_date, end_date, customer_id, start_date, end_date], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        var getRentalid = 'SELECT title FROM film WHERE film_id IN(SELECT film_id FROM inventory WHERE inventory_id IN (SELECT inventory_id FROM rental WHERE customer_id = ? and rental_date BETWEEN ? AND ?))'
                        conn.query(getRentalid, [customer_id, start_date, end_date], function (error, results) {
                            if (err) {
                                console.log(error);
                                return callback(error, null);
                            } else {
                                var total = 0
                                rental = []
                                for (j = 0; j < result.length; j++) {
                                    results[j]['amount'] = result[j].amount
                                    results[j]['payment_date'] = result[j].payment_date
                                    total += result[j].amount
                                }
                                rental.push({ "rental": results })
                                rental.push({ "total": total.toFixed(2) })
                                return callback(null, rental)
                            }
                        })

                    }
                })

            }
        });
    },

    addRental: function (title, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');

                const rental_date = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

                console.log("Connected to bed_dvd_db db in payment.js addRental function");
                var getInventoryId = 'SELECT inventory_id FROM inventory WHERE film_id IN (SELECT film_id FROM film WHERE title = ?)'
                conn.query(getInventoryId, [title], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        var staff_id = 1
                        var inventory_id=1
                        if(result.length !=0){
                        var inventory_id = result[0].inventory_id
                        }
                        const AddRentalQuery = 'INSERT INTO rental(rental_date,inventory_id,customer_id,return_date,staff_id) VALUES(?,?,?,?,?)'
                        conn.query(AddRentalQuery, [rental_date, inventory_id, 1, rental_date, staff_id], function (error, results) {
                            if (error) {
                                console.log(error);
                                return callback(err, null);
                            } else {
                                rental_id = results.insertId
                                const AddPaymentQuery = 'INSERT INTO payment(customer_id, staff_id, rental_id, amount, payment_date) VALUES(?,?,?,?,?)'
                                conn.query(AddPaymentQuery, [1, staff_id, rental_id, 1, rental_date], function (errors, res) {
                                    if (errors) {
                                        console.log(errors);
                                        return callback(err, null);
                                    } else {
                                        return callback(null, res.insertId)
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },
}
