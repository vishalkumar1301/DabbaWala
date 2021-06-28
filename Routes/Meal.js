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
                cookFirstName: "$cook.firstName",
                cookLastName: "$cook.lastName",
                cookAddress: "$cook.addresses",
            }
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
    order.userId = userId;
    order.orderTime = Date.now();
    order.save(function(err, result) {
        if(err) {
            logger.error(err);
        }
        res.json(new JSONResponse(null, Constants.SuccessMessages.OrderPlacedSuccessfully).getJson());
    });
});

mealRoute.get('/order', function (req, res) {
    let userId = req.user._id;
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
        }
        res.send(result);
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

mealRoute.get('/order/:id', function (req, res) {
    Order.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'meals',
                foreignField: '_id',
                localField: 'mealDetails.mealId',
                as: 'meals'
            }
        }
    ]).exec(function (err, result) {
        if(err) {
            logger.error(err);
        }
        res.send(result);
    })
});

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

module.exports = mealRoute;