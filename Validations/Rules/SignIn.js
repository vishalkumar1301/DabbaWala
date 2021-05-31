const { body } = require('express-validator')
const { Constants } = require('../../constants');

module.exports = {
    SignInValidationRule: [ 
        body('email').exists().withMessage(Constants.ErrorMessages.ProvideEmailAddress).isEmail().withMessage(Constants.ErrorMessages.ProvideValidEmail),
        body('password').exists().withMessage(Constants.ErrorMessages.ProvidePassword),
    ]   
};