const express = require('express');
const passport = require('passport');
const authenticationRoute = express.Router();

const User = require('../Models/user');
const { Constants } = require('../constants');
const { logger } = require('../Config/winston');
const { SignUpValidationRule } = require('../Validations/Rules/SignUp');
const { SignInValidationRule } = require('../Validations/Rules/SignIn');
const { SignUpValidationCheck } = require('../Validations/Checks/SignUp');
const { SignInValidationCheck } = require('../Validations/Checks/SignIn');
const { JSONResponse } = require('../Constants/Response');

require('../Authentication/auth')(passport);

authenticationRoute.post('/signup', SignUpValidationRule, SignUpValidationCheck, async (req, res, next) => {

    User.findOne({email: req.body.email}, function (err, user) {
        
        if (err) {
            console.log(err);
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
        }
        if(user) return res.json(new JSONResponse(Constants.ErrorMessages.EmailAlreadyExists).getJson());
        else {

            var newUser = new User();
            newUser.email = req.body.email;
            newUser.password = req.body.password;
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.phoneNumber = req.body.phoneNumber;
            newUser.userType = req.body.userType;

            newUser.save(function (err) {

                if(err) {
                    logger.error(err);
                    return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
                }
                return res.json(new JSONResponse(null, Constants.SuccessMessages.SignupSuccessfull).getJson());

            });

        }

    });

});

authenticationRoute.post('/signin', SignInValidationRule, SignInValidationCheck, passport.authenticate('local', {session: false}), async (req, res, next) => {
    res.json({
        message: Constants.SuccessMessages.SigninSuccessfull,
        user: req.user
    });
})

module.exports = authenticationRoute;