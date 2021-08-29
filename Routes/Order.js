const express = require('express');

const orderRoute = express.Router();
const OrderService = require('../Service/OrderService');
const { JSONResponse } = require('../Constants/Response');
const { Constants } = require('../constants');
const {logger} = require('../Config/winston');

// customer places an order
orderRoute.post('/', function (req, res) {
    OrderService.placeOrder(req.user._id , req.body.mealDetails, req.body.cookId, req.body.foodPrice, req.body.deliveryPrice, req.body.taxPrice, req.body.customerAddress, function (error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(new JSONResponse(null, success).getJson());
    });
});

// fetch the orders approved by cook
orderRoute.get('/cook/booked', function (req, res) {
    OrderService.fetchOrdersApprovedByCook (req.user._id, function (error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(success);
    });
})

// gets the orders, pending for approval by cook.
orderRoute.get('/cook/pending', function(req, res) {
    OrderService.fetchOrderPendingForApproval(req.user._id, function(error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(success);
    });
});

// cook approves an order based on availability
orderRoute.post('/cook/approve', function (req, res) {
    OrderService.cookApprovesOrder(req.body.orderId, function(error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(new JSONResponse(null, success).getJson());
    });
});

// cook rejects an order based on availability
orderRoute.post('/cook/reject', function (req, res) {
    OrderService.cookRejectsOrder(req.body.orderId, function(error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).send(new JSONResponse(null, success).getJson());
    });
});

orderRoute.get('/customer/booked', async function (req, res) {
    try {
        let orders = await OrderService.GetCustomerBookedOrders(req.user._id);
        res.status(200).send(orders);
    }
    catch (err) {
        logger.error('\nError in route /order/customer', err);
        res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
    }
});

// cook has prepared order
orderRoute.post('/cook/orderPrepared', async function (req, res) {
    try {
        let updateMessage = OrderService.OrderPrepared(req.body.orderId);
        res.status(200).json(new JSONResponse(null, updateMessage).getJson());
    }
    catch (err) {
        logger.error(err);
        res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
    }
})

module.exports = orderRoute;