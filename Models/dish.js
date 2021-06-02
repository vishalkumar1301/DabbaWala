const mongoose = require('mongoose');

const timestamp = require('./TimeStamp');

let dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    image: {
        type: String
    },
    cookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

dishSchema.plugin(timestamp);
module.exports = mongoose.model('Dish', dishSchema);