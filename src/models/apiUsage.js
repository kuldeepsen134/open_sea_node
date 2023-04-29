const mongoose = require('mongoose');

const apiUsageSchema = new mongoose.Schema({
    api_name:{
        type: String,
        default: null,
    },
    request:{
        type: Number,
        default: null,
    },
    errors:{
        type: Number,
        default: null,
    },
    avg_response_time:{
        type: String,
        default: null,
    }
},{ timestamps: true })

const apiUsages =new mongoose.model('apiUsage',apiUsageSchema)

module.exports = apiUsages