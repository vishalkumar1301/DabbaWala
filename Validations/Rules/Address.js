const { body } = require('express-validator');
const { Constants } = require('../../constants');

module.exports = {
    AddressValidationRule: [ 
        body('state').exists().withMessage(Constants.ErrorMessages.ProvideState).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('city').exists().withMessage(Constants.ErrorMessages.ProvideCity).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('pincode').exists().withMessage(Constants.ErrorMessages.ProvidePincode).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('address').exists().withMessage(Constants.ErrorMessages.ProvideAddresss).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('landmark').exists().withMessage(Constants.ErrorMessages.ProvideLandmark).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('saveAs').exists().withMessage(Constants.ErrorMessages.ProvideAddressType).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('latitude').exists().withMessage(Constants.ErrorMessages.ProvideLatitude).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('longitude').exists().withMessage(Constants.ErrorMessages.ProvideLongitude).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('streetOrBuildingName').exists().withMessage(Constants.ErrorMessages.ProvideStreetOrBuildingName).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString),
        body('mapsAddress').exists().withMessage(Constants.ErrorMessages.ProvideMapsAddress).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString)
    ]   
};