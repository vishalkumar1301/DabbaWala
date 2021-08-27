const admin = require("firebase-admin");
const DBUser = require('../DBLayer/DBUser');

class NotificationService {
    constructor() {
        var serviceAccount = require('../dabbawala-307114-firebase-adminsdk-1t0n7-8710d78c88.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    async OrderPlaced (fcmTokenIds, userIds) {

        let userFCMTokens = await DBUser.GetFcmTokenArrayForUsers(userIds);
        const message = {
            notification: {
                title: 'New Order coming',
                body: 'Approve/Reject'
            },
          tokens: userFCMTokens
        };

        admin.messaging().sendMulticast(message)
            .then((response) => {
            })
            .catch((error) => {
        });
    }

    async OrderApproved(fcmTokenIds, userIds) {
        
        let userFCMTokens = fcmTokenIds == null ? await DBUser.GetFcmTokenArrayForUsers(userIds) : fcmTOkenIds;

        const message = {
            notification: {
                title: 'Order Approved by cook',
                body: 'Order is being prepared'
            },
            tokens: userFCMTokens
        };
        
        admin.messaging().sendMulticast(message)
            .then((response) => {
            })
            .catch((error) => {
        });
    }

}

module.exports = new NotificationService();