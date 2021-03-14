const User = require('../Models/user');

let verifyLocalToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
    } else {
        // Forbidden
        next(new Error('Un-Authorized'));
    }
    
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({
            error :true
        });

        req.token= token;
        req.user=user;
        next();
    })
}

module.exports = { verifyLocalToken };