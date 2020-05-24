const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Cars = require('../models/cars');
const Transactions = require('../models/transactions');

const carRouter = express.Router();

carRouter.use(bodyParser.json());

carRouter.route('/')
.get((req,res,next) => {
    Cars.find({})
    .then((cars) => {
        if(cars.length > 0){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cars);
        }
        else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body>No cars found.</body></html>');
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    if(req.body.vehicleNo == undefined || req.body.vehicleNo == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body>Vehicle No Missing</body></html>');
        return;
    }

    if(req.body.model == undefined || req.body.model == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body>Model Number Missing</body></html>');
        return;
    }

    if(req.body.carName == undefined || req.body.carName == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body>Car Name Missing</body></html>');
        return;
    }

    if(req.body.description == undefined || req.body.description == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body>Description Missing</body></html>');
        return;
    }

    if(req.body.color == undefined || req.body.color == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body>Color Missing</body></html>');
        return;
    }

    if(req.body.price == undefined || req.body.price == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body>Price Missing</body></html>');
        return;
    }
    else{
        let val = parseFloat(req.body.price);
        if(isNaN(val)){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body>Price is not a Float</body></html>');
            return;
        }
    }

    if(req.body.seatingCap == undefined || req.body.seatingCap == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body>Seating Capacity Missing</body></html>');
        return;
    }
    else{
        let val = parseInt(req.body.seatingCap);
        if(isNaN(val)){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body>Seating Capacity not an integer</body></html>');
            return;
        }
        if(val != parseFloat(req.body.seatingCap)){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end('<html><body>Seating Capacity not an integer</body></html>');     
            return;   
        }

    }
    Cars.create(req.body)
    .then((car) => {
        console.log('Car Created ', car);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(car);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /cars');
})
.delete((req, res, next) => {
    Cars.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

carRouter.route('/:carId')
.get((req,res,next) => {

    if(req.params.carId == ""){
        res.statusCode = 200;
        res.setHeader("Content-Type",'text/html');
        res.end('<html><body><h1>Car Id provided was blank</h1></body></html>');
        return;
    }

    Cars.find({"vehicleNo":req.params.carId}).then((car) => {

        var currentDate = new Date();
        var isoDate = currentDate.toISOString();
        var response = {};
        Transactions.find({"vehicleNo":req.params.carId})
        .then((transactions) => {
            var counter;
            if(transactions.length > 0){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                response["car"] = car;
                var tranCounter = 1;
                for(counter=0;counter<transactions.length;++counter){
                    if(isoDate < transactions[counter]._doc.returnDate.toISOString()){
                        response["Transaction No :" + tranCounter++] = transactions[counter]._doc;
                    }
                }
                response["Total Future/Current Transactions"] = transactions.length;
                res.json(response);
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(car);
            }
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /cars/'+ req.params.carId);
})
.put((req, res, next) => {

    if(req.params.carId == ""){
        res.statusCode = 200;
        res.setHeader("Content-Type",'text/html');
        res.end('<html><body><h1>Car Id provided was blank</h1></body></html>');
        return;
    }

    var currentDate = new Date();
    var isoDate = currentDate.toISOString();

    Transactions.find({"vehicleNo":req.params.carId})
    .then((transactions) => {

        var counter;
        var booked = false;
        for(counter=0;counter<transactions.length;++counter){
            if(isoDate < transactions[counter]._doc.returnDate.toISOString()){
                booked = true;
                break;
            }
        }
        if(booked == true){
            res.statusCode = 200;
            res.setHeader("Content-Type",'text/html');
            res.end('<html><body><h1>Car booked, updation not allowed</h1></body></html>');
        }
        else{
                Cars.findOneAndUpdate({"vehicleNo":req.params.carId},
                {$set: req.body},{new:true})
                .then((car) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(car);
                }, (err) => next(err))
                .catch((err) => next(err));
        }

    },(err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {

    if(req.params.carId == ""){
        res.statusCode = 200;
        res.setHeader("Content-Type",'text/html');
        res.end('<html><body><h1>Car Id provided was blank</h1></body></html>');
        return;
    }

    var currentDate = new Date();
    var isoDate = currentDate.toISOString();

    Transactions.find({"vehicleNo":req.params.carId})
    .then((transactions) => {

        var counter;
        var booked = false;
        for(counter=0;counter<transactions.length;++counter){
            if(isoDate < transactions[counter]._doc.returnDate.toISOString()){
                booked = true;
                break;
            }
        }
        if(booked == true){
            res.statusCode = 200;
            res.setHeader("Content-Type",'text/html');
            res.end('<html><body><h1>Car booked, deletion not allowed</h1></body></html>');
        }
        else{
                Cars.findOneAndDelete({"vehicleNo":req.params.carId})
                .then((car) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(car);
                }, (err) => next(err))
                .catch((err) => next(err));
        }

    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports = carRouter;