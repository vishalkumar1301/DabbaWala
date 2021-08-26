const express = require('express');
const userRoute = express.Router();

const UserService = require('../Service/UserService');
const { JSONResponse } = require('../Constants/Response');

userRoute.get('/', function(req, res, next) {
    res.json({
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userType: req.user.userType,
        address: req.user.addresses.find(i => i.isSelected == true),
    })
});

userRoute.post('/fcmToken', function(req, res) {
    UserService.updateFCMToken(req.user.token, req.body.fcmToken, function(error, success, statusCode) {
        if(error) {
            res.status(statusCode).json(new JSONResponse(error).getJson());
        }
        res.status(statusCode).json(new JSONResponse(null, success).getJson());
    })
})

module.exports = userRoute;