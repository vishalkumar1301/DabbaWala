const { body } = require('express-validator/check')

module.exports = {
    SignUpValidationRule: [ 
        body('email', 'Invalid email').exists().isEmail(),
        body('password').exists().isStrongPassword(),
        body('phoneNumber').exists().isInt().isMobilePhone().isLength({ min: 10, max: 10}),
        body('firstName').exists().isString(),
        body('lastName').exists().isString(),
        body('userType').exists().isInt({ min: 1, max: 2})
    ]   
};