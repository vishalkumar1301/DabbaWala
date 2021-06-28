const express = require('express');
const userRoute = express.Router();

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

module.exports = userRoute;