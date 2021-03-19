const { validationResult } = require('express-validator/check');

var AddressValidationCheck = function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    AddressValidationCheck
}