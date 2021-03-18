const { body } = require('express-validator/check');
const { Constants } = require('../../constants');

module.exports = {
    SignUpValidationRule: [ 
        body('email').exists().withMessage(Constants.ErrorMessages.ProvideEmailAddress).isEmail().withMessage(Constants.ErrorMessages.ProvideValidEmail),
        body('password').exists().withMessage(Constants.ErrorMessages.ProvidePassword),
        body('phoneNumber').exists().withMessage(Constants.ErrorMessages.ProvidePhoneNumber).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString).isLength({ min: 10, max: 10}).withMessage(Constants.ErrorMessages.PhoneNumberShouldBe10Digit),
        body('firstName').exists().withMessage(Constants.ErrorMessages.ProvideValidFirstName).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('lastName').exists().withMessage(Constants.ErrorMessages.ProvideValidLastName).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('userType').exists().withMessage(Constants.ErrorMessages.ProvideValidUserType).isInt({ min: 1, max: 2}).withMessage(Constants.ErrorMessages.UserTypeCanOnlyBe123),
        body('state').exists().withMessage(Constants.ErrorMessages.ProvideState).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('city').exists().withMessage(Constants.ErrorMessages.ProvideCity).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('pincode').exists().withMessage(Constants.ErrorMessages.ProvidePincode).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('address').exists().withMessage(Constants.ErrorMessages.ProvideAddresss).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString)
    ]   
};