class Constants {
    static configPath = './Config/config.json';
    static ErrorMessages = {
        InternalServerError: 'Internal Server Error',
        EmailAlreadyExists: 'Email Already Exists',
        IncorrectEmail: 'IncorrectEmail',
        IncorrectPassword: 'IncorrectPassword',
        ProvideValidEmail: 'Provide valid email',
        ProvideValidStrongPassword: 'Provide valid strong password',
        ProvideValidPhoneNumber: 'Provide valid phone number',
        ProvideValidFirstName: 'Provide valid first name',
        ProvideValidLastName: 'Provide valid last name',
        ProvideValidUserType: 'Provide valid user type',
        ProvideValidState: 'Provide valid state',
        ProvideValidCity: 'Provide valid city',
        ProvideValidPincode: 'Provide valid pincode',
        ProvideValidAddresss: 'Provide valid address'
    };
    static SuccessMessages = {
        SignupSuccessfull: 'Signup Successfull',
        SigninSuccessfull: 'Signin Successfull'
    };
}

module.exports = {
    Constants
}