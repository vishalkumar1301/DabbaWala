class Constants {
    static configPath = './Config/config.json';
    static ErrorMessages = {
        InternalServerError: 'Internal Server Error',
        EmailAlreadyExists: 'Email Already Exists',
        IncorrectEmail: 'IncorrectEmail',
        IncorrectPassword: 'IncorrectPassword'
    };
    static SuccessMessages = {
        SignupSuccessfull: 'Signup Successfull',
        SigninSuccessfull: 'Signin Successfull'
    };
}

module.exports = {
    Constants
}