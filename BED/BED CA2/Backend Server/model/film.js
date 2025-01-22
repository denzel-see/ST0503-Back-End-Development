// DAAA1B07 Denzel See P2222840
const { json } = require('express/lib/response.js');
var db = require('./databaseConfig.js');

module.exports = {
    getFilm: function (category_id, callback) { // usually used by a single user to get own record
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to bed_dvd_db db in sakila.js getFilm function");
                var sql = `SELECT film.film_id, film.title, category.name AS "category",film.rating, film.release_year, film.length FROM film,category WHERE film_id IN (SELECT film_id FROM film_category WHERE category_id=?) AND category.category_id=?`;
                conn.query(sql, [category_id, category_id], function (err, result) {
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

    getDVD: function (title, category, max, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                
                console.log("Connected to bed_dvd_db db in film.js getDVD function");
                if (max == null || max.length == 0) {
                    max = 9999999
                }
                sub = '%' + title + '%'
                if (category == null || category.length == 0) {
                    var sql = `SELECT title, category.name AS category ,release_year,description,rental_rate FROM film INNER JOIN film_category ON film.film_id = film_category.film_id JOIN category ON film_category.category_id = category.category_id WHERE (title LIKE ? AND rental_rate <= ?) OR name = ?`;
                } else {
                    var sql = `SELECT title, category.name AS category ,release_year,description,rental_rate FROM film INNER JOIN film_category ON film.film_id = film_category.film_id JOIN category ON film_category.category_id = category.category_id WHERE (title LIKE ? AND rental_rate <= ?) AND name = ?`;
                }
                conn.query(sql, [sub, max, category], function (err, result) {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result)
                    }
                });
            }
        });
    },

    getDVDdetails: function (title, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                var sql = 'SELECT film.rating,first_name,last_name FROM film,actor WHERE title=? AND actor_id IN (SELECT actor_id FROM film_actor WHERE film_id IN (SELECT film_id FROM film WHERE title=?)) ORDER BY title';
                conn.query(sql, [title, title], function (err, result) {
                    conn.end()
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        if (result.length != 0) {
                            var results = new Object()
                            results.rating = result[0].rating
                            results.actors = ""
                            for (i = 0; i < result.length; i++) {
                                if (i != result.length - 1) {
                                    results.actors += result[i].first_name + " " + result[i].last_name + ", "
                                } else {
                                    results.actors += result[i].first_name + " " + result[i].last_name
                                }
                            }
                        }
                        else {
                            results = result
                        }

                        return callback(null, results);
                    }

                });
            }
        });
    },
}
