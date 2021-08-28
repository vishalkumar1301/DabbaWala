const admin = require("firebase-admin");

const {logger} = require('../Config/winston');

class NotificationService {
    constructor() {
        var serviceAccount = require('../dabbawala-307114-firebase-adminsdk-1t0n7-8710d78c88.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    async NotifyToADevice(fcmToken, notificationTitle, notificationMessage) {
        const message = {
            notification: {
                title: notificationTitle,
                body: notificationMessage,
            },
            token: fcmToken
        };

        await admin.messaging().send(message).then(function(response) {
            console.log(response);
        }).catch(function(error) {
            console.log(error);
        });
    }

    async NotifyToDevices(fcmTokens, notificationTitle, notificationMessage) {
        const message = {
            notification: {
                title: notificationTitle,
                body: notificationMessage,
            },
            tokens: fcmTokens
        };

        await admin.messaging().sendMulticast(message).then(function(response) {
            // console.log(response);
        }).catch(function(error) {
            logger.error(error);
            console.log(error);
        });
    }
}

module.exports = new NotificationService();