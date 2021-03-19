const { body } = require('express-validator/check');
const { Constants } = require('../../constants');

module.exports = {
    AddressValidationRule: [ 
        body('state').exists().withMessage(Constants.ErrorMessages.ProvideState).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('city').exists().withMessage(Constants.ErrorMessages.ProvideCity).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('pincode').exists().withMessage(Constants.ErrorMessages.ProvidePincode).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('address').exists().withMessage(Constants.ErrorMessages.ProvideAddresss).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString)
    ]   
};