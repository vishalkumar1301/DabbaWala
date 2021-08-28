const NotificationService = require('./NotificationService');
const DBUser = require('../DBLayer/DBUser');
const DBOrder = require('../DBLayer/DBOrder');

class OrderNotifications{
    async OrderPlaced (orderId) {
        let order = await DBOrder.GetOrderCustomerAndCookByOrderId(orderId);
        console.log(order.customer.fcmToken)
        console.log(order.cook.fcmToken)
        NotificationService.NotifyToADevice(order.customer.fcmToken, "Your Order has been Placed", "Waiting for confimation from cook");
        NotificationService.NotifyToADevice(order.cook.fcmToken, "New Order", `${order.customer.firstName} ${order.customer.lastName} ordered ${order.order.dishes.length} ${order.order.mealType}`);
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

module.exports = new OrderNotifications();