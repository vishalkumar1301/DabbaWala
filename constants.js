class Constants {
    static configPath = './Config/config.json';
    static ErrorMessages = {
        ValueShouldBeString: 'Value should be string',
        InternalServerError: 'Internal Server Error',
        EmailAlreadyExists: 'Email Already Exists',
        IncorrectEmail: 'IncorrectEmail',
        IncorrectPassword: 'IncorrectPassword',
        ProvideEmailAddress: 'Provide email address',
        ProvideValidEmail: 'Provide valid email address',
        ProvidePassword: 'Provide password',
        ProvideValidStrongPassword: 'Provide valid strong password',
        PhoneNumberShouldBe10Digit: 'Phone number should be 10 digit',
        ProvideValidPhoneNumber: 'Provide valid phone number',
        ProvideValidFirstName: 'Provide valid first name',
        ProvideValidLastName: 'Provide valid last name',
        ProvideValidUserType: 'Provide valid user type',
        ProvideState: 'Provide state',
        ProvideCity: 'Provide city',
        ProvidePincode: 'Provide pincode',
        ProvideAddresss: 'Provide address',
        UserTypeCanOnlyBe123: 'User type can only be 1, 2 or 3'
    };
    static SuccessMessages = {
        SignupSuccessfull: 'Signup Successfull',
        SigninSuccessfull: 'Signin Successfull'
    };
}

module.exports = {
    Constants
}