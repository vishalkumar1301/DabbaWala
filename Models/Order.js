const mongoose = require('mongoose');

const timestamp = require('./TimeStamp');

let orderSchema = new mongoose.Schema({
    mealDetails: [
        {
            mealId: {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Meal'
            },
            quantity: {
                required: true,
                type: Number,
            }
        }
    ],
    cookId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    customerId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isOrderConfirmedByCook: {
        required: true,
        default: false,
        type: Boolean
    },
    orderConfirmedByCookTime: {
        required: false,
        type: Date
    },
    isDelivered: {
        required: true,
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    deliveryTime: {
        required: false,
        type: Date
    },
    isPickedUp: {
        required: true,
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    pickupTime: {
        required: false,
        type: Date
    },
    orderTime: { 
        required: true,
        type: Date
    },
    deliveryPersonAssigned: {
        required: true,
        default: false,
        type: Boolean
    },
    deliverPersonId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveryPersonAssignTime: {
        required: false,
        type: Date
    },
    foodPrice: {
        required: true,
        type: Number
    },
    deliveryPrice: {
        required: true,
        type: Number
    },
    taxPrice: {
        required: true,
        type: Number
    },
    totalPrice: {
        required: true,
        type: Number
    }
}); 

orderSchema.plugin(timestamp);
module.exports = mongoose.model('Order', orderSchema);