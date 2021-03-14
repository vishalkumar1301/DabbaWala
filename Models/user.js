const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const timestamp = require('./TimeStamp');
const { configuration } = require('../config');

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    userType: {
        type: Number,
        required: true
    },
    token: {
        type: String
    }
});

userSchema.plugin(timestamp);

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.IsValidPassword = async function (password, next) {
    bcrypt.compare(password, this.password, function(err, isMatch){
        if(err) return next(err);
        next(null,isMatch);
    });
}

userSchema.methods.generateToken = async function (next) {
    var token = jwt.sign({id: this._id}, configuration.jwtSecretKey);
    this.token = token;
    UserModel.findOneAndUpdate({ _id: this._id }, {token: token}, { new: true}, function (err, user) {
        if(err) return next(err);
        next(null, user);
    });
}

userSchema.statics.findByToken = async function (token, next) {
    jwt.verify(token, configuration.jwtSecretKey, function (err, decode) {
        this.findOne({ "_id": decode, "token": token}, function (err, user) {
           if(err) return next(err) ;
           next(null, user);
        });
    })
}


userSchema.methods.deleteToken= async function(token, next) {
    this.update({$unset: {token: 1}}, function(err, user) {
        if(err) return next(err);
        next(null, user);
    });
}

var UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;