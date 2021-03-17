const { body } = require('express-validator/check')

module.exports = {
    SignInValidationRule: [ 
        body('email', 'Invalid email').exists().isEmail(),
        body('password').exists(),
    ]   
};