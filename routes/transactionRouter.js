const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Transactions = require('../models/transactions');
const Cars = require('../models/cars');

const transactionRouter = express.Router();

transactionRouter.use(bodyParser.json());


transactionRouter.route('/')
.get((req,res,next) => {
    Transactions.find({})
    .then((transactions) => {
        if(transactions.length > 0){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(transactions);
        }
        else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json([]);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {


    if(req.body.vehicleNo == undefined || req.body.vehicleNo == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('Vehicle No Missing');
        return;
    }

    if(req.body.name == undefined || req.body.name == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('Name Missing');
        return;
    }

    if(req.body.phoneNo == undefined || req.body.phoneNo == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('Phone Number Missing');
        return;
    }

    if(req.body.issueDate == undefined || req.body.issueDate == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('Start Date Missing');
        return;
    }

    if(req.body.returnDate == undefined || req.body.returnDate == ""){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('Return Date Missing');
        return;
    }

    var currentDate = new Date();
    var isoDate = currentDate.toISOString();

    var issueDate = new Date(req.body.issueDate);
    var returnDate = new Date(req.body.returnDate);
    var isoIssueDate = issueDate.toISOString();
    var isoReturnDate = returnDate.toISOString();

    if(isoDate > isoIssueDate){
        res.statusCode = 200;
        res.setHeader("Content-Type",'text/html');
        res.end('Booking can only be done for future dates'); 
        console.log("Date Problem 1"); 
        return;
    }

    if( isoIssueDate > isoReturnDate){
        res.statusCode = 200;
        res.setHeader("Content-Type",'text/html');
        res.end('Issue Date set higher than return date');
        console.log("Date Problem 2");
        return;
    }

    var diff_in_time = returnDate.getTime() - issueDate.getTime();
    var days = Math.floor(diff_in_time/(3600*24*1000));

    if( days < 0){
        res.statusCode = 200;
        res.setHeader("Content-Type",'text/html');
        res.end('Booking for less than a day not allowed');
        console.log("Date Problem 3");
        return;
    }

    Cars.find({"vehicleNo":req.body.vehicleNo}).then((car) => {
        console.log(car.length + "#");

        if (car.length > 0){

            // var totalprice = car[0]._doc.price.value * days;
            // req.body["price"] = totalprice;

            Transactions.find({"vehicleNo":req.body.vehicleNo})
            .then((transactions) => {
                 var i;
                 var booked = false;
                 for(i=0;i<transactions.length;i++){
                    booked = false;
                    // console.log("********************");
                    // console.log(isoIssueDate + " " + isoReturnDate + " " + transactions[i]._doc.issueDate.toISOString() + " " + transactions[i]._doc.returnDate.toISOString());
                    // console.log("*********************");

                    var isoDBIssueDate = transactions[i]._doc.issueDate.toISOString();
                    var isoDBReturnDate = transactions[i]._doc.returnDate.toISOString();

                    if(  isoIssueDate > isoDBIssueDate && isoIssueDate < isoDBReturnDate){
                        booked = true;
                        break;
                    }
                    else if( isoReturnDate > isoDBIssueDate && isoReturnDate < isoDBReturnDate){
                        booked = true;
                        break;
                    }
                    else if( isoIssueDate < isoDBIssueDate && isoReturnDate > isoDBReturnDate ){
                        booked = true;
                        break;
                    }
                 }


                if(booked == true){
                    res.statusCode = 200;
                    res.setHeader("Content-Type",'text/html');
                    res.end('Car already booked');
                }
                else{
                Transactions.create(req.body)
                .then((transaction) => {
                    console.log('Car Created ', transaction);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(transaction);
                }, (err) => next(err))
                .catch((err) => next(err));
                        
                 }
            },(err) => next(err))
            .catch((err) => next(err));
        }
        else{
            res.statusCode = 200;
            res.setHeader("Content-Type",'text/html');
            res.end('No such car exists');
        }
        }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Transactions');
})
.delete((req, res, next) => {
    Transactions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

transactionRouter.route('/:transactionId')
.get((req,res,next) => {
    Transactions.findById(req.params.transactionId)
    .then((transaction) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(transaction);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /transactions/'+ req.params.transactionId);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Transactions/'+ req.params.transactionId);
})
.delete((req, res, next) => {
    Transactions.findByIdAndRemove(req.params.transactionId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = transactionRouter;