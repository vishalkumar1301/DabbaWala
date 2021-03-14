const express = require('express');
const passport = require('passport');
const authenticationRoute = express.Router();

const User = require('../Models/user');
const { Constants } = require('../constants');
const { logger } = require('../Config/winston');
const { verifyLocalToken } = require('../Authentication/verifyLocalToken');
require('../Authentication/auth')(passport);

authenticationRoute.post('/signup', async (req, res, next) => {

    User.findOne({email: req.body.email}, function (err, user) {
        
        if (err) {
            logger.error(err);
            return res.json({message: Constants.ErrorMessages.InternalServerError});
        }
        if(user) return res.json({message: Constants.ErrorMessages.EmailAlreadyExists});
        else {

            var newUser = new User();
            newUser.email = req.body.email;
            newUser.password = req.body.password;
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.phoneNumber = req.body.phoneNumber;
            newUser.userType = req.body.userType;

            console.log(req.body);
            newUser.save(function (err) {

                if(err) {
                    logger.error(err);
                    console.log(err);
                    return res.json({message: Constants.ErrorMessages.InternalServerError});
                }
                return res.json({
                    message: Constants.SuccessMessages.SignupSuccessfull,
                });

            });

        }

    });

});

authenticationRoute.post('/signin', passport.authenticate('local', {session: false}), async (req, res, next) => {
    res.json({
        message: Constants.SuccessMessages.SigninSuccessfull,
        user: req.user
    });
})

module.exports = authenticationRoute;