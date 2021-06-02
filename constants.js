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
        UserTypeCanOnlyBe012: 'User type can only be 0, 1 or 2',
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
        AddressIdShouldBe24CharactersLong: 'Address Id should be 24 charachter long',
        ProvideMeals: 'Provide meals',
        ProvideMealName: 'Provide meal name',
        ProvideMealDescription: 'Provide meal description',
        ValueShouldBeInteger: 'Value should be integer',
        ProvideDescription: 'Provide description',
        ProvidePrice: 'Provide price',
        ProvideMealType: 'Provide meal type',
        ValueShouldBeBreakfastLunchOrDinner: 'Value should be Breakfast lunch or dinner',
        ProvideJSONData: 'Provide stringify json data',
        InvalidToken: 'Invalid token',
        DummyError: 'dummy error'
    };
    static SuccessMessages = {
        SignupSuccessfull: 'Signup Successfull',
        SigninSuccessfull: 'Signin Successfull',
        AddressAddedSuccessfully: 'Address added successfully',
        AddressAlreadyExists: 'Address already exists',
        ChangedDefaultAddress: 'Changed default address',
        BreakfastAdded: 'Breakfast Added'
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