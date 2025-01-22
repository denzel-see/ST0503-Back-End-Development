// DAAA1B07 Denzel See P2222840
const req = require('express/lib/request.js');
var db = require('./databaseConfig.js');

module.exports = {

    getActor: function (actorid, callback) { // usually used by a single user to get own record
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                // console.log("Connected!"); // NOT useful
                console.log("Connected to bed_dvd_db db in actor.js getActor function");
                var sql = `SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?`;
                conn.query(sql, [actorid], function (err, result) {
                    conn.end();
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

    getActors: function (limit, offset, callback) { // usually used by admin

        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to bed_dvd_db db in actor.js getActors function");
                var sql = `SELECT * FROM actor ORDER BY first_name LIMIT ? OFFSET ?`;
                if (isNaN(limit) && isNaN(offset)) {
                    var sql = `SELECT * FROM actor ORDER BY first_name LIMIT 20 OFFSET 0`;
                } else if (isNaN(limit) && !(isNaN(offset))) {
                    var sql = `SELECT * FROM actor ORDER BY first_name LIMIT 20 OFFSET ?`
                } else if (!(isNaN(limit)) && isNaN(offset)) {
                    var sql = `SELECT * FROM actor ORDER BY first_name LIMIT ? OFFSET 0`
                }
                conn.query(sql, [limit, offset], function (err, result) {
                    conn.end();
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

    addActor: function (first_name, last_name, callback) {
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to bed_dvd_db db in actor.js addActor function");
                var sql = 'Insert into actor(first_name,last_name) values(?,?)';

                conn.query(sql, [first_name, last_name], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result.insertId);
                    }
                });
            }
        });
    },

    updateActor: function (actorid, actor, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection gt issue!
                console.log(err);
                return callback(err, null);
            } else {
                const getActorQuery = `SELECT first_name , last_name FROM actor WHERE actor_id = ?`;
                dbConn.query(getActorQuery, [actorid], (error, results) => {
                    if (error) {
                        return callback(error, null);
                    } else {
                        var {first_name,last_name} = actor
                        if(first_name==undefined && last_name == undefined){
                            bothNull=true
                        }
                        if(first_name == undefined) first_name = results[0].first_name
                        if(last_name == undefined) last_name = results[0].last_name
                        const editActorQuery = `UPDATE actor SET first_name = ?, last_name = ? WHERE actor_id = ?`
                        dbConn.query(editActorQuery, [first_name, last_name,actorid])
                        return callback(null, results);
                    }
                });
            }
        });
    },

    deleteActor: function (actorid, callback) { // usually used by a single user to get own record
        var conn = db.getConnection();
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                console.log("Connected to bed_dvd_db db in actor.js deleteActor function");
                var sql = 'DELETE FROM actor WHERE actor_id=?';
                conn.query(sql, [actorid], function (err, result) {
                    conn.end();
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result.affectedRows);
                    }
                });
            }
        });
    },
}