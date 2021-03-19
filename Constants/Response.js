class JSONResponse {
    constructor(errorName, successMessage) {
        this.errorName = errorName;
        this.successMessage = successMessage;
    }
    getJson () {
        var responseObject = {};

        if ( this.errorName ) {
            var errors = [];
            errors.push({ msg: this.errorName});
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