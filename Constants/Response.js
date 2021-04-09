class JSONResponse {
    constructor(errorName, successMessage, parameterName, location) {
        this.errorName = errorName;
        this.successMessage = successMessage;
        this.parameterName = parameterName;
        this.location = location;
    }
    getJson () {
        var responseObject = {};

        if ( this.errorName ) {
            var errors = [];
            if(this.parameterName && this.location) {
                errors.push({ msg: this.errorName, param: this.parameterName, location: this.location})
            }
            else{
                errors.push({ msg: this.errorName});
            }
            responseObject.errors = errors;
            return responseObject;
        }
        if(this.successMessage) {
            responseObject.message = this.successMessage;
            return responseObject;
        }
    }
}

module.exports = {
    JSONResponse
}