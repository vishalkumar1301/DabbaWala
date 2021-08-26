const Meal = require('../Models/meal');
const {logger} = require('../Config/winston');

class MealService {
    addMealForCook (cookId, dishes, imagesFileNames, price, mealType, callback) {
        let meal = new Meal();
        meal.dishes = dishes.map(i => {
            return {
                name: i.name,
                description: i.description
            }
        });
        
        meal.cookId = cookId;
        meal.images = imagesFileNames.map(file => file.filename);
        meal.date = Date.now();;
        meal.price = price;
        meal.mealType = mealType;
        meal.dishNames += meal.dishes.map(dish => {
            return dish.name + dish.description;
        })
        meal.save(function (err) {
            if(err) {
                logger.error(err);
                callback(Constants.ErrorMessages.InternalServerError, null, 500);
            }
            callback(null, mealType + ' Added', 200);
        });
    }

    getMealForCustomer (searchQuery, takeElements, skipElements, callback) {
        let take = parseInt(takeElements);
        let skip = parseInt(skipElements);
        var predicate = this.buildPredicate(searchQuery)

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
                callback(Constants.ErrorMessages.InternalServerError, null, 500);
            }
            callback(null, result, 200);
        })
    }

    buildPredicate (dishName) {
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
}

module.exports = new MealService();