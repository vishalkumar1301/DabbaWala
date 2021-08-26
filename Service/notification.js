var admin = require("firebase-admin");

class Notification {
    constructor() {
        var serviceAccount = require('../dabbawala-307114-firebase-adminsdk-1t0n7-8710d78c88.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
}

module.exports = new Notification();