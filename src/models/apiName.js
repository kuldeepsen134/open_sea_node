const mongoose = require("mongoose");

const apiNameSchema = new mongoose.Schema({
    name: {
        type: String,
    },
},
    {
        timestamps: true
    })

const ApiNames = new mongoose.model("apiname", apiNameSchema);

module.exports = ApiNames;