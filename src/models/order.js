const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
    },
    plan_name: {
        type: String,
    },
    plan_id: {
        type: String,
    },
    total: {
        type: String,
    },
    transactionId: {
        type: String,
    },
    userId: {
        type: String,
    },
    api_name: {
        type: String,
    },
    planExpireDate: {
        type: String,
    },

    invoice_id: {
        type: String,
    },
    isPayment: {
        type: Boolean,
    },
},
    {
        timestamps: true
    })

const Orders = new mongoose.model("order", orderSchema);

module.exports = Orders;