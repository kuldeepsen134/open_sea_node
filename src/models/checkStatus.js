const mongoose = require("mongoose")

const paymentStatusSchema = new mongoose.Schema({

    order_id: {
        type: String,
    },
    invoice_id: {
        type: String,
    },
    payment_data: {
        type: Array,
    },
},
    {
        timestamps: true
    })

const PaymentStatusChecks = new mongoose.model("paymentStatusCheck", paymentStatusSchema);

module.exports = PaymentStatusChecks