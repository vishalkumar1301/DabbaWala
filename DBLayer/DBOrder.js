class Order {
    getFCMTokenIdsForCookAndCustomerByOrderId(orderId) {
        Order.aggregate([
            {
                $match: {
                    _id: orderId,
                }
            }, 
            {
                $lookup: {
                    from: "users",
                    localField: "mealDetails.mealId",
                    foreignField: "_id",
                    as: "order"
                }
            }
        ])
    }
}