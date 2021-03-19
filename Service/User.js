const { User } = require('../Models/user');

var AddAddress = function (user, address) {
    User.update(
        { _id: user._id }, 
        { $push: { addresses: address } },
        done
    );
}


module.exports = {
    AddAddress
}