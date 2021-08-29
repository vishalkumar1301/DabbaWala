const express = require('express');
const multer = require('multer');

const mealRoute = express.Router();
const MealService = require('../Service/MealService');
const { storage } = require('../database');
const { JSONResponse } = require('../Constants/Response');
const { mealValidation } = require('../Validations/CustomValidation/meal');

var upload = multer({ storage: storage })

// cook adds a meal
mealRoute.post('/', upload.array('photos', 4), function (req, res) {
    // validation check
    var error = mealValidation(req, res)
    if(error) {
        return error;
    }

    MealService.addMealForCook (req.user._id, req.body.meal, req.files, req.body.price, req.body.mealType, function(error, success, statusCode) {
        if(error) {
            return res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        return res.status(statusCode).json(new JSONResponse(null, success).getJson());
    });
    
});

// fetch all the meals for customer
mealRoute.get('/', function (req, res) {
    MealService.getMealForCustomer (req.query.search, req.query.take, req.query.skip, function (error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(success);
    });
})

module.exports = mealRoute;