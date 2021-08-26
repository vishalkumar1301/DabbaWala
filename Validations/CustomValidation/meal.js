const { JSONResponse } = require('../../Constants/Response');
const { Constants } = require('../../constants');

var mealValidation = function (req, res, next) {
    if(!req.body.meal) {
        // error
        return res.status(422).json(new JSONResponse(Constants.ErrorMessages.ProvideMeals, null, 'meal', 'body').getJson());
    }
    
    if(req.body.meal.length == 0) {
        // error
        return res.status(422).json(new JSONResponse(Constants.ErrorMessages.ProvideMeals, null, 'meal', 'body').getJson());
    }

    try {
        let meal = JSON.parse(req.body.meal);
        req.body.meal = meal;
    }
    catch (error) {
        return res.status(422).json(new JSONResponse(Constants.ErrorMessages.ProvideJSONData, null, 'meal', 'body').getJson());
    }

    req.body.meal.map(element => {
        if (!element.name) {
            return res.status(422).json(new JSONResponse(Constants.ErrorMessages.ProvideMealName, null, 'meal', 'body').getJson());
        }            

        if (!element.description) {
            return res.status(422).json(new JSONResponse(Constants.ErrorMessages.ProvideMealDescription, null, 'meal', 'body').getJson());
        }
    });

    if(!req.body.mealType) {
        // error
        return res.status(422).json(new JSONResponse(Constants.ErrorMessages.ProvideMealType, null, 'mealType', 'body').getJson());
    }
    if(req.body.mealType !== 'Breakfast' && req.body.mealType !== 'Lunch' && req.body.mealType !== 'Dinner') {
        // error
        return res.status(422).json(new JSONResponse(Constants.ErrorMessages.ValueShouldBeBreakfastLunchOrDinner, null, 'mealType', 'body').getJson());
    }
    if (!req.body.price) {
        return res.status(422).json(new JSONResponse(Constants.ErrorMessages.ProvidePrice, null, 'price', 'body').getJson());
    }
}

module.exports = {
    mealValidation
}