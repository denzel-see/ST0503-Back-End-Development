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

    addRental: function (customer_id, inventory_id, rental_date, return_date, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to bed_dvd_db db in payment.js addRental function");
                const getRentalRateQuery = 'SELECT film.rental_duration, film.rental_rate, inventory.store_id  FROM film,inventory WHERE film.film_id IN (SELECT inventory.film_id FROM inventory WHERE inventory_id = ?) AND inventory_id =? ';
                conn.query(getRentalRateQuery, [inventory_id, inventory_id], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        var staff_id = result[0].store_id
                        const AddRentalQuery = 'INSERT INTO rental(rental_date,inventory_id,customer_id,return_date,staff_id) VALUES(?,?,?,?,?)'
                        conn.query(AddRentalQuery, [rental_date, inventory_id, customer_id, return_date, staff_id], function (error, results) {
                            if (error) {
                                console.log(error);
                                return callback(err, null);
                            } else {
                                var rental_id = results.insertId
                                var rental_duration = result[0].rental_duration
                                var rental_rate = result[0].rental_rate
                                var rental_dateFix = String(rental_date).slice(0,10)
                                var return_dateFix = String(return_date).slice(0,10)
                               
                                function convertDate(str) {
                                    var segments = str.split("-");
                                    return new Date(segments[1] + "/" + segments[2] + "/" + segments[0]);
                                }
                                var date_diff = convertDate(return_dateFix) - convertDate(rental_dateFix)
                                var days = Math.floor(date_diff / (24 * 60 * 60 * 1000));
                                var excess = days-rental_duration
                                var amount = rental_rate + excess
                                const AddPaymentQuery = 'INSERT INTO payment(customer_id, staff_id, rental_id, amount, payment_date) VALUES(?,?,?,?,?)'
                                conn.query(AddPaymentQuery,[customer_id,staff_id,rental_id,amount,rental_date], function(errors,res){
                                    if(errors){
                                        console.log(errors);
                                        return callback(err, null);
                                    } else {
                                        return callback(null,res.insertId)
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