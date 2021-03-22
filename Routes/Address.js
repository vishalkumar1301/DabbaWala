const express = require('express');
const addressRoute = express.Router();

const User = require('../Models/user');
const { AddressValidationRule } = require('../Validations/Rules/Address');
const { AddressValidationCheck } = require('../Validations/Checks/Address');
const { verifyLocalToken } = require('../Authentication/verifyLocalToken');
const { Constants } = require('../constants');
const { JSONResponse } = require('../Constants/Response');

addressRoute.use(verifyLocalToken);

addressRoute.post('/', AddressValidationRule, AddressValidationCheck, async (req, res, next) => {
    // general check for all the address fields
    var index = req.user.addresses.findIndex(x => x.city === req.body.city && x.state === req.body.state && x.pincode === req.body.pincode && x.address === req.body.address && x.landmark === req.body.landmark && x.streetOrBuildingName === req.body.streetOrBuildingName);
    if(index < 0) {
        User.findOneAndUpdate({ _id: req.user._id }, { $push: { addresses: { city: req.body.city, state: req.body.state, pincode: req.body.pincode, address: req.body.address, landmark: req.body.landmark, streetOrBuildingName: req.body.streetOrBuildingName, saveAs: req.body.saveAs, latitude: req.body.latitude, longitude: req.body.longitude, mapsAddress: req.body.mapsAddress} } }, function (err, user) {
            if(err) {
                res.status(500).json(new JSONResponse(Constants.ErrorMessages.InternalServerError).getJson());
            };
            res.json(new JSONResponse(null, Constants.SuccessMessages.AddressAddedSuccessfully).getJson());
        });
    } else {
        res.status(409).json(new JSONResponse(null, Constants.SuccessMessages.AddressAlreadyExists).getJson());
    }
});

addressRoute.get('/', AddressValidationCheck, async (req, res, next) => {
    res.json(req.user.addresses);
});

module.exports = addressRoute;