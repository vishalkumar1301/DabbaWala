const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const mealRoute = express.Router();
const { Constants } = require('../constants')
const { JSONResponse } = require('../Constants/Response');
const { storage } = require('../database');
const { mealValidation } = require('../Validations/CustomValidation/meal');
const Meal = require('../Models/meal');
const Order = require('../Models/Order');
const {logger} = require('../Config/winston');

var upload = multer({ storage: storage })

mealRoute.post('/', upload.array('photos', 4), function (req, res) {
    // validation check
    var error = mealValidation(req, res)
    if(error) {
        return error;
    }

    let meal = new Meal();
    meal.dishes = req.body.meal.map(i => {
        return {
            name: i.name,
            description: i.description
        }
    });
    
    meal.cookId = req.user._id;
    meal.images = req.files.map(file => file.filename);
    meal.date = Date.now();;
    meal.price = req.body.price;
    meal.mealType = req.body.mealType;
    meal.dishNames += meal.dishes.map(dish => {
        return dish.name + dish.description;
    })
    meal.save(function (err) {
        if(err) {
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        return res.json(new JSONResponse(null, req.body.mealType + ' Added').getJson());
    });
});

mealRoute.get('/', function (req, res) {
    let search = req.query.search;
    let take = parseInt(req.query.take);
    let skip = parseInt(req.query.skip);
    var predicate = buildPredicate(search)

    Meal.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "cookId",
                foreignField: "_id",
                as: "cook"
            }
        },
        {
            $unwind: "$cook"
        },
        {
            $unwind: "$cook.addresses"
        }, 
        {
            $match: {
                "cook.addresses.isSelected": true
            }
        }, 
        {
            $match: predicate
        },
        {
            $project: {
                _id: 1,
                dishes: 1,
                price: 1,
                mealType: 1,
                images: 1,
                cookId: "$cook._id",
                cookFirstName: "$cook.firstName",
                cookLastName: "$cook.lastName",
                cookAddress: "$cook.addresses",
            }
        },
        {
            $skip: skip,
        },
        {
            $limit: take
        }
    ]).exec(function (err, result) {
        if(err) {
            logger.error(err);
        }
        res.send(result);
    })
})

mealRoute.post('/order', function (req, res) {
    let userId = req.user._id;

    let order = new Order();
    order.mealDetails = req.body.mealDetails.map(i => {
        return {
            mealId: mongoose.Types.ObjectId(i.mealId),
            quantity: i.quantity
        }
    });
    order.customerId = userId;
    order.cookId = req.body.cookId;
    order.foodPrice = req.body.foodPrice;
    order.deliveryPrice = req.body.deliveryPrice;
    order.taxPrice = req.body.taxPrice;
    order.totalPrice = order.foodPrice + order.deliveryPrice + order.taxPrice;
    order.orderTime = Date.now();
    order.customerAddress.state = req.body.customerAddress.state;
    order.customerAddress.city = req.body.customerAddress.city;
    order.customerAddress.pincode = req.body.customerAddress.pincode;
    order.customerAddress.address = req.body.customerAddress.address;
    order.customerAddress.streetOrBuildingName = req.body.customerAddress.streetOrBuildingName;
    order.customerAddress.landmark = req.body.customerAddress.landmark;
    order.customerAddress.latitude = req.body.customerAddress.latitude;
    order.customerAddress.longitude = req.body.customerAddress.longitude;
    order.customerAddress.mapsAddress = req.body.customerAddress.mapsAddress;
    order.save(function(err, result) {
        if(err) {
            logger.error(err);
            console.log(err)
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        return res.json(new JSONResponse(null, Constants.SuccessMessages.OrderPlacedSuccessfully).getJson());
    });
});

// all the orders
mealRoute.get('/order', function (req, res) {
    Order.aggregate([
        {
            $lookup: {
                from: "meals",
                localField: "mealDetails.mealId",
                foreignField: "_id",
                as: "order"
            }
        }
    ]).exec(function (err, result) {
        if(err) {
            logger.error(err);
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        res.send(result);
    });
});

// gets the orders already booked by the current cook
mealRoute.get('/order/cook/booked', function (req, res) {
    Order.aggregate([
        {
            $match: {
                cookId: mongoose.Types.ObjectId(req.user._id),
                isOrderConfirmedByCook: true,
            }
        },
        {
            $lookup: {
                from: "meals",
                localField: "mealDetails.mealId",
                foreignField: "_id",
                as: "order"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "customerId",
                foreignField: "_id",
                as: "customerDetails"
            }
        },
        {
            $unwind: "$customerDetails"
        },
        {
            $project: {
                customerFirstName: "$customerDetails.firstName",
                customerLastName: "$customerDetails.lastName",
                customerId: "$customerDetails._id",
                cookId: 1,
                foodPrice: 1,
                deliveryPrice: 1,
                taxPrice: 1,
                totalPrice: 1,
                orderTime: 1,
                mealDetails: 1,
                order: 1,
                orderId: "$_id"
            }
        }
    ]).exec(function (err, result) {
        if(err) {
            logger.error(err);
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        res.send(RefactorOrderList(result));
    });
})

// gets the orders, pending for approval by cook.
mealRoute.get('/order/cook/pending', function(req, res) {
    Order.aggregate([
        {
            $match: {
                cookId: mongoose.Types.ObjectId(req.user._id),
                isOrderConfirmedByCook: false
            }
        },
        {
            $lookup: {
                from: "meals",
                localField: "mealDetails.mealId",
                foreignField: "_id",
                as: "order"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "customerId",
                foreignField: "_id",
                as: "customerDetails"
            }
        },
        {
            $unwind: "$customerDetails"
        },
        {
            $project: {
                customerFirstName: "$customerDetails.firstName",
                customerLastName: "$customerDetails.lastName",
                customerId: "$customerDetails._id",
                cookId: 1,
                foodPrice: 1,
                deliveryPrice: 1,
                taxPrice: 1,
                totalPrice: 1,
                orderTime: 1,
                mealDetails: 1,
                order: 1,
                orderId: "$_id"
            }
        }
    ]).exec(function (err, result) {
        if(err) {
            logger.error(err);
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        res.send(RefactorOrderList(result));
    });
});

mealRoute.get('/:id', function (req, res) {
    Meal.aggregate([
        {
            $match: {
                "_id": mongoose.Types.ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'cookId',
                as: 'cook'
            }
        }
    ]).exec(function (err, result) {
        if(err) {
            logger.error(err);
        }
        res.send(result);
    });
});

// mealRoute.get('/order/:id', function (req, res) {
//     Order.aggregate([
//         {
//             $match: {
//                 _id: mongoose.Types.ObjectId(req.params.id)
//             }
//         },
//         {
//             $lookup: {
//                 from: 'meals',
//                 foreignField: '_id',
//                 localField: 'mealDetails.mealId',
//                 as: 'meals'
//             }
//         }
//     ]).exec(function (err, result) {
//         if(err) {
//             logger.error(err);
//             return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
//         }
//         res.send(result);
//     })
// });

function buildPredicate (dishName) {
    if(dishName == undefined || dishName == '') return {};
    return {
        $or: [
            {
                "dishNames": { $regex: dishName, $options: "i" }
            },
            {
                "cook.firstName": { $regex: dishName, $options: "i" }
            },
            {
                "cook.lastName": { $regex: dishName, $options: "i" }
            },
            {
                "mealType": { $regex: dishName, $options: "i" }
            }
        ]
    };
}

function RefactorOrderList(result) {
    return result.map(i => {
        let index = 0;
        return {
            mealDetails: i.order.map(j => {
                return {
                    dishes: j.dishes,
                    images: j.images,
                    mealType: j.mealType,
                    price: j.price,
                    quantity: i.mealDetails[index++].quantity
                }
            }),
            cookId: i.cookId,
            foodPrice: i.foodPrice,
            deliveryPrice: i.deliveryPrice,
            taxPrice: i.taxPrice,
            totalPrice: i.totalPrice,
            orderTime: i.orderTime,
            customerFirstName: i.customerFirstName,
            customerLastName: i.customerLastName,   
            customerId: i.customerId,
            orderId: i.orderId,
        }
    });
}

module.exports = mealRoute;