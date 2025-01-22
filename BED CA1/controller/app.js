// DAAA1B07 Denzel See P2222840
var express = require('express');
var actor = require('../model/actor.js')
var film = require('../model/film.js')
var payment = require('../model/payment.js')
var customer = require('../model/customer.js');



var app = express();

app.use(express.json());// parse application/json
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded

//ENDPOINT 1 Return actor information of the given actor_id.(DONE)
app.get('/actors/:actorid', function (req, res) { // url MUST follow specified requirements

    var actorid = parseInt(req.params.actorid);

    if (isNaN(actorid)) {
        res.status(404).json({ message: `Unacceptable record ID` });
    } else {
        actor.getActor(actorid, function (err, result) {
            if (!err) {
                if (result.length == 0) {
                    res.status(204).json({ msg: "No Content. Record of given actor_id cannot be found." });
                } else {
                    res.status(200).json(result);
                }
            } else {
                res.status(500).json({ "error_msg": "Internal server error" });
            }
        });
    }
});

//ENDPOINT 2 Return the list of actors ordered by first_name, limited to 20 records offset 0 by default.(DONE)
app.get('/actors', function (req, res) { // url MUST follow specified requirements
    limit = parseInt(req.query.limit)
    offset = parseInt(req.query.offset)

    actor.getActors(limit, offset, function (err, result) {
        if (!err) {
            res.status(200).json(result)
        } else {
            res.status(500).json({ "error_message": "Internal server error" });
        }
    });
});

//ENDPOINT 3 Add a new actor to the database (note: actors can have the same first_name and last_name)(DONE)
app.post('/actors', function (req, res) { // url MUST follow specified requirements

    var { first_name, last_name } = req.body;
    actor.addActor(first_name, last_name, function (err, result) {
        if (!err) {
            res.status(201).json({ "actor_id": result }); // more common
        } else {
            if (first_name == null || last_name == null) {
                res.status(400).json({ "error_msg": "missing data" })
            } else {
                res.status(500).json({ "error_msg": "Internal server error" });
            }
        }
    });
});

//ENDPOINT 4 Update actor’s first name or last name or both.(DONE)
app.put('/actors/:actorid', function (req, res, next) {
    bothNull = false
    const actorid = parseInt(req.params.actorid);
    if (isNaN(actorid)) {
        res.status(404).json({ message: `Unacceptable record ID` });
    } else {
        actor.updateActor(actorid, req.body, (error, results) => {
            if (!error) {
                if (results == null) {
                    res.status(204).json();
                } else if (bothNull) {
                    res.status(400).json({ "error_msg": "missing data" })
                } else {
                    res.status(200).json({ "success_msg": "record updated" })
                }
            } else {
                console.log(error)
                res.status(500).json({ "error_msg": `Internal server error` });
            }
        });
    }
});


//ENDPOINT 5 Remove actor from database.(DONE)
app.delete('/actors/:actorid', function (req, res) {

    var actorid = parseInt(req.params.actorid);
    if (isNaN(actorid)) {
        res.status(404).json({ message: `Unacceptable record ID` });
    } else {
        actor.deleteActor(actorid, function (err, result) {
            if (!err) {
                if (result == 0) {
                    res.status(204).json()
                } else {
                    res.status(200).json({ "success_msg": "actor deleted" });
                }
            } else {
                res.status(500).json({ "error_msg": "Internal server error" });
            }
        });
    }

});

//ENDPOINT 6 Return the film_id, title, rating, release_year and length of  all films belonging to a category.(DONE)
app.get('/film_categories/:category_id/films', function (req, res) {

    var category_id = parseInt(req.params.category_id);

    if (isNaN(category_id)) {
        res.status(404).json({ message: `Unacceptable record ID` });
    } else {
        film.getFilm(category_id, function (err, result) {
            if (!err) {
                res.status(200).json(result);
            } else {
                res.status(500).json({ "error_msg": "Internal server error" });
            }
        });
    }

});

//ENDPOINT 7 Return the payment detail of a customer between the provided period. (DONE)
app.get('/customer/:customer_id/payment', function (req, res) {

    var customer_id = parseInt(req.params.customer_id);
    var start_date = (req.query.start_date);
    var end_date = (req.query.end_date);

    if (isNaN(customer_id)) {
        res.status(404).json({ message: `Unacceptable record ID` });
    } else {
        payment.getCustomer(customer_id, start_date, end_date, function (err, result) {
            if (!err) {
                res.status(200).json(result);
            } else {
                res.status(500).json({ "error_msg": "Internal server error" });
            }
        });
    }

});

//ENDPOINT 8 Add a new customer to the database (note: customer’s email address is unique)(DONE)
app.post('/customers', function (req, res) {
    unique = true
    nullTrue = false
    undefinedTrue = false
    var { store_id, first_name, last_name, email, address_line1, address_line2, district, city_id, postal_code, phone } = req.body;

    customer.addCustomer(store_id, first_name, last_name, email, address_line1, address_line2, district, city_id, postal_code, phone, function (err, result) {
        if (!err) {
            res.status(201).json({ "customer_id": result });
        } else {
            if (undefinedTrue || nullTrue){
                res.status(400).json({"error_msg": "missing data"})
            }
            else if (unique == false) {
                res.status(409).json({ "error_msg": "email already exist" })
            } else{
            res.status(500).json({ "error msg": `Internal server error` });
            }
        }
    });
});

//ADDITIONAL ENDPOINT 9 Update customer's address using their customer id (DONE)
app.put('/customer/address/:customer_id', function (req, res, next) {
    cityidFalse = false
    const customer_id = parseInt(req.params.customer_id);
    if (isNaN(customer_id)) {
        res.status(404).json({ message: `Unacceptable record ID` });
    } else {
        customer.updateAddress(customer_id, req.body, (error, results) => {
            if (!error) {
                if (results == null) {
                    res.status(204).json();
                } else if (cityidFalse) {
                    res.status(400).json({ "error_msg": "city_id invalid" })
                } else {
                    res.status(200).json({ "success_msg": "record updated" })
                }
            } else {
                console.log(error)
                res.status(500).json({ "error_msg": `Internal server error` });
            }
        });
    }
});

//ADDITIONAL ENDPOINT 10 Renting a new film
app.post('/rental/payment/:customer_id/:inventory_id', function (req, res) { // url MUST follow specified requirements

    var customer_id = parseInt(req.params.customer_id);
    var inventory_id = parseInt(req.params.inventory_id);
    var { rental_date, return_date} = req.body;

    if (isNaN(customer_id || inventory_id)) {
        res.status(404).json({ message: `Unacceptable record ID` });
    } else {
        payment.addRental(customer_id, inventory_id, rental_date, return_date, function (err, result) {
            if (!err) {
                if(result == null){
                    res.status(200).json({"error_msg": "missing data"});
                } else{
                res.status(200).json({"payment_id":result});
                }
            } else {
                res.status(500).json({ "error_msg": "Internal server error" });
            }
        });
    }
});
module.exports = app

