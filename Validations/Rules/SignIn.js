const { body } = require('express-validator/check')
const { Constants } = require('../../constants');

module.exports = {
    SignInValidationRule: [ 
        body('email').exists().isEmail().ErrorMessages(Constants.ErrorMessages.ProvideValidEmail),
        body('password').exists(),
    ]   
};