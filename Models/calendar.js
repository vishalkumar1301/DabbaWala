const mongoose = require('mongoose');

const timestamp = require('./TimeStamp');

let cookCalendarSchema = new mongoose.Schema({
    dishIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish',
            required: true
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
    }
});

cookCalendarSchema.plugin(timestamp);
module.exports = mongoose.model('CookCalendar', cookCalendarSchema);