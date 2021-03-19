const express = require('express');
const passport = require('passport');
const addressRoute = express.Router();

const User = require('../Models/user');
const { Constants } = require('../constants');
const { logger } = require('../Config/winston');
const { AddressValidationRule } = require('../Validations/Rules/Address');
const { AddressValidationCheck } = require('../Validations/Checks/Address');
const { verifyLocalToken } = require('../Authentication/verifyLocalToken');

addressRoute.use(verifyLocalToken);

addressRoute.post('/', AddressValidationRule, AddressValidationCheck, async (req, res, next) => {
    console.log(req.user, req.token);
    res.json('sdf');
});

addressRoute.get('/', AddressValidationRule, AddressValidationCheck, async (req, res, next) => {
    res.json({
        message: Constants.SuccessMessages.SigninSuccessfull,
        user: req.user
    });
})

module.exports = addressRoute;