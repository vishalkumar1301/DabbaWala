// 3rd party modules
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// custom modules
const UserService = require('../Service/UserService');

module.exports = async function (passport) {
    passport.use(new localStrategy({usernameField: 'email'}, function (username, password, done) {
        return UserService.userSignIn(username, password, done);
    }));
}