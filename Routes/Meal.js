const express = require('express');
const multer = require('multer');

const mealRoute = express.Router();
const { JSONResponse } = require('../Constants/Response');
const { storage } = require('../database');
const { mealValidation } = require('../Validations/CustomValidation/meal');
const MealService = require('../Service/MealService');
const OrderService = require('../Service/OrderService');

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

// customer places an order
mealRoute.post('/order', function (req, res) {
    OrderService.placeOrder(req.user._id , req.body.mealDetails, req.body.cookId, req.body.foodPrice, req.body.deliveryPrice, req.body.taxPrice, req.body.customerAddress, function (error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(new JSONResponse(null, success).getJson());
    });
});

// fetch the orders approved by cook
mealRoute.get('/order/cook/booked', function (req, res) {
    OrderService.fetchOrdersApprovedByCook (req.user._id, function (error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(success);
    });
})

// gets the orders, pending for approval by cook.
mealRoute.get('/order/cook/pending', function(req, res) {
    OrderService.fetchOrderPendingForApproval(req.user._id, function(error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(success);
    });
});

// cook approves an order based on availability
mealRoute.post('/order/cook/approve', function (req, res) {
    OrderService.cookApprovesOrder(req.body.orderId, function(error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(new JSONResponse(null, success).getJson());
    });
});

// cook rejects an order based on availability
mealRoute.post('/order/cook/reject', function (req, res) {
    OrderService.cookRejectsOrder(req.body.orderId, function(error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(new JSONResponse(null, success).getJson());
    });
});

module.exports = mealRoute;