const express = require('express');
const multer = require('multer');

const mealRoute = express.Router();
const { Constants } = require('../constants')
const { JSONResponse } = require('../Constants/Response');
const { storage } = require('../database');
const { mealValidation } = require('../Validations/CustomValidation/meal');
const Dish = require('../Models/dish');
const Calendar = require('../Models/calendar');

var upload = multer({ storage: storage })

mealRoute.post('/meal', upload.array('photos', 4), function (req, res) {
    console.log(req.body);
    // validation check
    var error = mealValidation(req, res)
    if(error) {
        return error;
    }
    let dishes = req.body.meal.map(element => {
        var newDish = new Dish();
        newDish.name = element.name;
        newDish.description = element.description;
        newDish.date = Date.now();
        newDish.cookId = req.user._id;
        return newDish;
    });
    Dish.insertMany(dishes, function (err, savedDishes) {
        if(err) {
            // logger.error(err);
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        let calendar = new Calendar();
        calendar.dishIds = savedDishes.map(a => a._id);
        calendar.cookId = req.user._id;
        calendar.images = req.files.map(file => file.filename);
        calendar.date = savedDishes[0].date;
        calendar.save(function (err) {
            if(err) {
                // logger.error(err);
                return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
            }
            return res.json(new JSONResponse(null, Constants.SuccessMessages.BreakfastAdded).getJson());
        });
    });
});

module.exports = mealRoute;