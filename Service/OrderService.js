const mongoose = require('mongoose');
var admin = require("firebase-admin");

const { Constants } = require('../constants');
const {logger} = require('../Config/winston');
const Order = require('../Models/Order');
const OrderNotifications = require('../Notification/OrderNotifications');

class OrderService {

    placeOrder(customerId, mealDetails, cookId, foodPrice, deliveryPrice, taxPrice, customerAddress, callback) {
        let order = new Order();
        order.mealDetails = mealDetails.map(i => {
            return {
                mealId: mongoose.Types.ObjectId(i.mealId),
                quantity: i.quantity
            }
        });
        order.customerId = customerId;
        order.cookId = cookId;
        order.foodPrice = foodPrice;
        order.deliveryPrice = deliveryPrice;
        order.taxPrice = taxPrice;
        order.totalPrice = order.foodPrice + order.deliveryPrice + order.taxPrice;
        order.orderTime = Date.now();
        order.customerAddress.state = customerAddress.state;
        order.customerAddress.city = customerAddress.city;
        order.customerAddress.pincode = customerAddress.pincode;
        order.customerAddress.address = customerAddress.address;
        order.customerAddress.streetOrBuildingName = customerAddress.streetOrBuildingName;
        order.customerAddress.landmark = customerAddress.landmark;
        order.customerAddress.latitude = customerAddress.latitude;
        order.customerAddress.longitude = customerAddress.longitude;
        order.customerAddress.mapsAddress = customerAddress.mapsAddress;
        order.save(function(err, result) {
            if(err) {
                logger.error(err);
                callback(Constants.ErrorMessages.InternalServerError, null, 500);
            }

            OrderNotifications.OrderPlaced(result._id);

            callback(null, Constants.SuccessMessages.OrderPlacedSuccessfully, 200);
        });
    }

    fetchOrdersApprovedByCook (cookId, callback) {
        Order.aggregate([
            {
                $match: {
                    cookId: mongoose.Types.ObjectId(cookId),
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
        ]).exec((err, result) => {
            if(err) {
                logger.error(err);
                callback(Constants.ErrorMessages.InternalServerError, null, 500);
            }
            callback(null, this.refactorOrderList(result), 200);
        });
    }

    fetchOrderPendingForApproval(cookId, callback) {
        Order.aggregate([
            {
                $match: {
                    cookId: mongoose.Types.ObjectId(cookId),
                    isOrderConfirmedByCook: false,
                    isOrderRejectedByCook: false
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
        ]).exec((err, result) => {
            if(err) {
                logger.error(err);
                callback(Constants.ErrorMessages.InternalServerError, null, 500);
            }
            callback(null, this.refactorOrderList(result), 200);
        });
    }

    cookApprovesOrder(orderId, callback) {
        Order.findOneAndUpdate({ _id: orderId }, { isOrderConfirmedByCook: true, orderConfirmedByCookTime: Date.now() }, function (err, order) {
            if(err) {
                logger.error(err);
                callback(Constants.ErrorMessages.InternalServerError, null, 500);
            };

            NotificationService.OrderApproved(orderId);

            callback(null, Constants.SuccessMessages.OrderAcceptedByCook, 200);
        })
    }

    cookRejectsOrder(orderId, callback) {
        Order.findOneAndUpdate({ _id: orderId }, { isOrderRejectedByCook: true, orderRejectedByCookTime: Date.now() }, function (err, order) {
            if(err) {
                logger.error(err);
                callback(Constants.ErrorMessages.InternalServerError, null, 500);
            };

            NotificationService.OrderRejected(orderId)

            callback(null, Constants.SuccessMessages.OrderRejectedByCook, 200);
        })
    }

    refactorOrderList(result) {
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
                totalFoodPrice: i.foodPrice,
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
}

module.exports = new OrderService();