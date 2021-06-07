const express = require('express');
const multer = require('multer');

const mealRoute = express.Router();
const { Constants } = require('../constants')
const { JSONResponse } = require('../Constants/Response');
const { storage } = require('../database');
const { mealValidation } = require('../Validations/CustomValidation/meal');
const Meal = require('../Models/meal');
const {logger} = require('../Config/winston');

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
    
    meal.cook = req.user._id;
    meal.images = req.files.map(file => file.filename);
    meal.date = Date.now();;
    meal.price = req.body.price;
    meal.mealType = req.body.mealType;

    meal.save(function (err) {
        if(err) {
            logger.error(err);
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        return res.json(new JSONResponse(null, req.body.mealType + ' Added').getJson());
    });
});

mealRoute.get('/meal', function (req, res) {
    Meal.find({isAvailable: true}).populate({
        path: 'cook',
        select: '-password -userType -updatedAt -createdAt -__v -token',
        populate: {
            path: "addresses",
            match: {
                isSelected: true
            }
        }
    }).select('-updatedAt -createdAt -__v').exec(function (err, users) {
        return res.send(users);
    })
})

module.exports = mealRoute;