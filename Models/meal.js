const mongoose = require('mongoose');

const timestamp = require('./TimeStamp');

let cookMealSchema = new mongoose.Schema({
    dishNames : {
        type: String,
        required: true,
        default: ''
    },
    dishes: [
        {
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    cookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [
        {
            type: String
        }
    ],
    date: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    mealType: {
        type: String,
        required: true
    }
});

cookMealSchema.plugin(timestamp);

module.exports = mongoose.model('Meal', cookMealSchema);