class Constants {
    static configPath = './Config/config.json';
    static ErrorMessages = {
        UserUnAuthorized: 'Un-Authorized Access',
        ValueShouldBeString: 'Value should be string',
        ValueShouldBeBoolean: 'Value should be boolean',
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
        UserTypeCanOnlyBe123: 'User type can only be 1, 2 or 3',
        ProvideLandmark: 'Provide landmark',
        ProvideSelectedType: 'Provide selected type',
        ProvideLatitude: 'Provide latitude',
        ProvideLongitude: 'Provide longitude',
        ProvideStreetOrBuildingName: 'Provide street or building name',
        ProvideMapsAddress: 'Provide maps address',
        ProvideAddressType: 'Provide address type',
        HomeIsAlreadySelected: 'Home is already selected',
        WorkIsAlreadySelected: 'Work is already selected',
        ProvideAddressId: 'Provide address id',
        AddressNotFound: 'Address not found',
        AddressIdShouldBe24CharactersLong: 'Address Id should be 24 charachter long'
    };
    static SuccessMessages = {
        SignupSuccessfull: 'Signup Successfull',
        SigninSuccessfull: 'Signin Successfull',
        AddressAddedSuccessfully: 'Address added successfully',
        AddressAlreadyExists: 'Address already exists',
        ChangedDefaultAddress: 'Changed default address'
    };
    static AddressType = {
        Work: 'Work',
        Home: 'Home',
        Other: 'Other'
    }
}

module.exports = {
    Constants
}