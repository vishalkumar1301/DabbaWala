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
    console.log(meal);
    meal.save(function (err) {
        if(err) {
            logger.error(err);
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        return res.json(new JSONResponse(null, req.body.mealType + ' Added').getJson());
    });
});

mealRoute.get('/meal', function (req, res) {
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
            $match: {
                isAvailable: true
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
                isAvailable: 0, 
                cookId: 0,
                date: 0,
                updatedAt: 0,
                createdAt: 0,
                __v: 0,
                "cook._id": 0,
                "cook.email": 0,
                "cook.password": 0,
                "cook.token": 0,
                "cook.phoneNumber": 0,
                "cook.__v": 0,
                "cook.updatedAt": 0,
                "cook.createdAt": 0,
            }
        }
    ]).exec(function (err, result) {
        res.send(result);
    })
})

module.exports = mealRoute;