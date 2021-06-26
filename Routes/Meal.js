const express = require('express');
const multer = require('multer');

const mealRoute = express.Router();
const { Constants } = require('../constants')
const { JSONResponse } = require('../Constants/Response');
const { storage } = require('../database');
const { mealValidation } = require('../Validations/CustomValidation/meal');
const Meal = require('../Models/meal');
const {logger} = require('../Config/winston');
const User = require('../Models/user');

var upload = multer({ storage: storage })

mealRoute.post('/meal', upload.array('photos', 4), function (req, res) {
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
    });

    meal.save(function (err) {
        if(err) {
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        return res.json(new JSONResponse(null, req.body.mealType + ' Added').getJson());
    });
});

mealRoute.get('/meal', function (req, res) {
    let dishName = req.query.dishName;
    Meal.aggregate([
        {
            $match: {
                "dishNames": { $regex: dishName, $options: "i" },
                isAvailable: true
            }
        },
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
            $project: {
                _id: 0,
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
        res.send(result);
    })
})

module.exports = mealRoute;