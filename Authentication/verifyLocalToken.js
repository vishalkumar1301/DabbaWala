const User = require('../Models/user');
const { JSONResponse } = require('../Constants/Response');
const { Constants } = require('../constants');

let verifyLocalToken = (req, res, next) => {
    console.log("verify token");
    console.log(req.body)
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
    } else {
        // Forbidden
        return res.status(499).json(new JSONResponse(Constants.ErrorMessages.UserUnAuthorized).getJson());
    }
    
    User.findByToken(req.token, (err, user) => {
        if (err) {
            return res.status(500).json(new JSONResponse(Constants.ErrorMessages.InvalidToken).getJson())
        }
        if(!user) {
            return res.status(401).json(new JSONResponse(Constants.ErrorMessages.UserUnAuthorized).getJson());
        }
        req.user = user;
        next();
    })
}

module.exports = { verifyLocalToken };