const mongoose = require('mongoose');

const Order = require('../Models/Order');

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
}

module.exports = new DBOrder();