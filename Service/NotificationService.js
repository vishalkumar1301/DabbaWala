const admin = require("firebase-admin");
const DBUser = require('../DBLayer/DBUser');
const DBOrder = require('../DBLayer/DBOrder');

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

    async OrderApproved(orderId) {
        
        let customerFCMToken = await DBOrder.getFCMTokenIdOfCustomerByOrderId(orderId);

        const message = {
            notification: {
                title: 'Order Approved by cook',
                body: 'Order is being prepared'
            },
            token: customerFCMToken
        };
        
        admin.messaging().send(message)
            .then((response) => {
            })
            .catch((error) => {
        });
    }

    async OrderRejected(orderId) {

        let customerFCMToken = await DBOrder.getFCMTokenIdOfCustomerByOrderId(orderId);

        const message = {
            notification: {
                title: 'Order rejected by cook',
                body: 'get lost'
            },
            token: customerFCMToken
        };
        
        admin.messaging().send(message)
            .then((response) => {
            })
            .catch((error) => {
        });
    }

}

module.exports = new NotificationService();