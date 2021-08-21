const { User: UserModel } = require('../Models/user');

class User {
    userSignIn (email, password) {
        UserModel.findOne({email: email}, function (err, user) {
            if(err) return done(err);
            if(!user) return done(null, false);
            
            user.IsValidPassword(password, (err, isMatch)=>{
                if(err) return done(err);
                if(!isMatch) {
                    return done(null, false)
                }
                if(user.token) {
                    return done(null, {
                        token: user.token,
                        userType: user.userType, 
                    });
                }
                user.generateToken((err, user) => {
                    if(err) return done(err);
                    return done(null, {user: user});
                });
            });
        });
    }
}

module.exports = {
    AddAddress
}