const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    limit: {
        type: Number,
    },
    price: {
        type: Number,
    },
    benifits: [{ type: String }]
},
    {
        timestamps: true
    })

const Plans = new mongoose.model("plan", planSchema)
module.exports = Plans;