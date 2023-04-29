const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    orderId: {
        type: String,
    },
},
    { timestamps: true })


const Transactions = new mongoose.model("transaction", transactionSchema)

module.exports = Transactions