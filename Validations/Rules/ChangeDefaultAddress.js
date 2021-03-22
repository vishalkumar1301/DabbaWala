const { body } = require('express-validator/check');
const { Constants } = require('../../constants');

module.exports = {
    ChangeDefaultAddress: [ 
        body('addressId').exists().withMessage(Constants.ErrorMessages.ProvideAddressId).isString().withMessage(Constants.ErrorMessages.ValueShouldBeString).isLength({ min: 24, max: 24}).withMessage(Constants.ErrorMessages.AddressIdShouldBe24CharactersLong)
    ]   
};