const mongoose = require('mongoose');

const Order = require('../Models/Order');
const {logger} = require('../Config/winston');

class DBOrder {
    async getFCMTokenIdOfCustomerByOrderId(orderId) {
        let result = await Order.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(orderId),
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            {
                $unwind: '$customer'
            },
            {
                $project: {
                    fcmToken: '$customer.fcmToken'
                }
            }
        ]).exec();
        return result[0].fcmToken;
    }

    async GetOrderCustomerAndCookByOrderId(orderId) {
        try {
            let order = await Order.aggregate([
                {
                    $match: {
                        _id: mongoose.Types.ObjectId(orderId),
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
                    $lookup: {
                        from: "users",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customer"
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
                    $unwind: "$order"
                },
                {
                    $unwind: "$cook",
                },
                {
                    $unwind: "$customer"
                }
            ]).exec();
            console.log(order[0]);
            return order[0];
        }
        catch (err) {
            logger.error(err);
        }
    }

    async GetOrdersByCustomerId(customerId) {
        let orders = await Order.aggregate([
            {
                $match: {
                    customerId: mongoose.Types.ObjectId(customerId),
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
                    localField: "cookId",
                    foreignField: "_id",
                    as: "cook"
                }
            },
            {
                $unwind: '$cook'
            }
        ]).exec();

        try {
            return orders;
        }
        catch (err) {
            logger.error('\nError in GetOrdersByCustomerId in DBOrder.js');
            throw err;
        }
    }
}

module.exports = new DBOrder();