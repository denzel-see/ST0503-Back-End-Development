// DAAA1B07 Denzel See P2222840
const { json } = require('express/lib/response.js');
var db = require('./databaseConfig.js');

module.exports={
getFilm: function (category_id, callback) { // usually used by a single user to get own record
    var conn = db.getConnection();
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return callback(err, null);
        } else {
            console.log("Connected to bed_dvd_db db in sakila.js getFilm function");
            var sql = `SELECT film.film_id, film.title, category.name AS "category",film.rating, film.release_year, film.length FROM film,category WHERE film_id IN (SELECT film_id FROM film_category WHERE category_id=?) AND category.category_id=?`;
            conn.query(sql, [category_id,category_id], function (err, result) {
                conn.end()
                if (err) {
                    console.log(err);
                    return callback(err, null);
                } else {
                    return callback(null, result);
                }
                
            });
        }
    });
},
}
