const { body } = require('express-validator/check');
const { Constants } = require('../../constants');

module.exports = {
    SignUpValidationRule: [ 
        body('email').exists().withMessage(Constants.ErrorMessages.ProvideEmailAddress).isEmail().withMessage(Constants.ErrorMessages.ProvideValidEmail),
        body('password').exists().withMessage(Constants.ErrorMessages.ProvidePassword),
        body('phoneNumber').exists().withMessage(Constants.ErrorMessages.ProvidePhoneNumber).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString).matches(/[1-9][0-9]{9}/, "i").withMessage(Constants.ErrorMessages.ProvideValidPhoneNumber),
        body('firstName').exists().withMessage(Constants.ErrorMessages.ProvideValidFirstName).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('lastName').exists().withMessage(Constants.ErrorMessages.ProvideValidLastName).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('userType').exists().withMessage(Constants.ErrorMessages.ProvideValidUserType).isInt({ min: 1, max: 2}).withMessage(Constants.ErrorMessages.UserTypeCanOnlyBe123)
    ]   
};