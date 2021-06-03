const User = require('../Models/user');
const { JSONResponse } = require('../Constants/Response');
const { Constants } = require('../constants');

let verifyLocalToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
    } else {
        // Forbidden
        return res.status(401).json(new JSONResponse(Constants.ErrorMessages.InvalidToken).getJson());
    }
    
    User.findByToken(req.token, (err, user) => {
        if (err) {
            return res.status(401).json(new JSONResponse(Constants.ErrorMessages.InvalidToken).getJson())
        }
        if(!user) {
            return res.status(401).json(new JSONResponse(Constants.ErrorMessages.InvalidToken).getJson());
        }
        req.user = user;
        next();
    })
}

module.exports = { verifyLocalToken };