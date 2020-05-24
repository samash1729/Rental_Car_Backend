const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Transactions = require('../models/transactions');
const Cars = require('../models/cars');

const searchRouter = express.Router();

searchRouter.use(bodyParser.json());



searchRouter.route('/')
.get((req,res,next) => {


    var issueDate = new Date();
    var returnDate = new Date();
    var isoIssueDate = '';
    var isoReturnDate = '';
    var query = {};
    var removeCar = [];
    var currentDate = new Date();
    var isoDate = currentDate.toISOString();




    if(req.url.includes("?")){
        let q=req.url.split('?'),result={};
        if(q.length>=2){
          q[1].split('&').forEach((item)=>{
               try {
                 result[item.split('=')[0]]=item.split('=')[1];
               } catch (e) {
                 result[item.split('=')[0]]='';
               }
          })
        }
        result["issueDate"] = result["issueDate"].replace(/%3A/g,":");
        result["returnDate"] = result["returnDate"].replace(/%3A/g,":");
        if(result["seatingCap"] != undefined && result["seatingCap"] != ""){
            query["seatingCap"] = result["seatingCap"];
        }
        issueDate = new Date(result["issueDate"]);
        returnDate = new Date(result["returnDate"]);
        isoIssueDate = issueDate.toISOString();
        isoReturnDate = returnDate.toISOString();

    }
    else{

        if(req.body.issueDate == undefined || req.body.returnDate == undefined){
             res.statusCode = 200;
             res.setHeader("Content-Type",'text/html');
             res.end('<html><body><h1>One of the dates was not sent in request</h1></body></html>');
             return;
        }

        if(req.body.issueDate == "" || req.body.returnDate == ""){
            res.statusCode = 200;
            res.setHeader("Content-Type",'text/html');
            res.end('<html><body><h1>One or more dates were empty</h1></body></html>');
            return;
        }


        if(req.body.issueDate < isoDate){
            res.statusCode = 200;
            res.setHeader("Content-Type",'text/html');
            res.end('<html><body><h1>Searches can only be done for future dates/time</h1></body></html>');
            return;        
        }

        if(req.body.seatingCap != undefined && req.body.seatingCap != ''){
            query['seatingCap'] = req.body.seatingCap;
        }
        issueDate = new Date(req.body.issueDate);
        returnDate = new Date(req.body.returnDate);
        isoIssueDate = issueDate.toISOString();
        isoReturnDate = returnDate.toISOString();

    }
    console.log(query);
    Cars.find(query)
    .then((cars) => {
        var counter;
        var total = 0;
        var check = 0;  
        console.log(cars.length);
        total = cars.length;
        if(total == 0){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json([]);
            return;
        }
        for(counter=0;counter<cars.length;counter++){
            Transactions.find({"vehicleNo":cars[counter].vehicleNo})
            .then((transactions) => {
                var tranCounter;
                var booked = false;
                for(tranCounter=0;tranCounter<transactions.length;tranCounter++){

                    var isoDBIssueDate = transactions[tranCounter].issueDate.toISOString();
                    var isoDBReturnDate = transactions[tranCounter].returnDate.toISOString();

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
                    var recounter = 0;
                    for(recounter=0;recounter<cars.length;recounter++){
                        if(cars[recounter].vehicleNo == transactions[0].vehicleNo){
                            cars.splice(recounter,1);
                        }
                    }
                    //cars.splice(tranCounter,1);
                }
                check++;

                if(check == total){
                    if(cars.length == 0){
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        res.json([]);

                    }
                    else{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        console.log(cars)
                        res.json(cars);
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Searches');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Searches');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /Searches');
});

module.exports = searchRouter;