const { body } = require('express-validator/check');
const { Constants } = require('../../constants');

module.exports = {
    SignUpValidationRule: [ 
        body('email').exists().isEmail().ErrorMessages(Constants.ErrorMessages.ProvideValidEmail),
        body('password').exists().isStrongPassword().ErrorMessages(Constants.ErrorMessages.ProvideValidStrongPassword),
        body('phoneNumber').exists().isString().isMobilePhone().isLength({ min: 10, max: 10}).ErrorMessages(Constants.ErrorMessages.ProvideValidPhoneNumber),
        body('firstName').exists().isString().ErrorMessages(Constants.ErrorMessages.ProvideValidFirstName),
        body('lastName').exists().isString().ErrorMessages(Constants.ErrorMessages.ProvideValidLastName),
        body('userType').exists().isInt({ min: 1, max: 2}).ErrorMessages(Constants.ErrorMessages.ProvideValidUserType),
        body('state').exists().isString().ErrorMessages(Constants.ErrorMessages.ProvideValidStrongPassword),
        body('city').exists().isString().ErrorMessages(Constants.ErrorMessages.ProvideValidStrongPassword),
        body('pincode').exists().isString().ErrorMessages(Constants.ErrorMessages.ProvideValidStrongPassword),
        body('address').exists().isString().ErrorMessages(Constants.ErrorMessages.ProvideValidStrongPassword)
    ]   
};