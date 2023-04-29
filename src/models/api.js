const mongoose = require("mongoose");

const ApiSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"]
        },
        title: {
            type: String
        },
        desc: {
            type: String
        },
        child_id: {
            type: String,
            default: ""
        },
        parent_id: {
            type: String,
            default: ""
        },
        information: {
            method: {
                type: String,
                required: [true, "method is required"]
            },
            url: {
                type: String,
                required: [true, "method is required"]
            },
            headers: {
                type: Object,
                default: {}
            },
            params: {
                type: Object,
                default: {}
            },
            data: {
                type: Object,
                default: {}
            }
        }


    },
    { timestamps: true }
);

module.exports = mongoose.model("api", ApiSchema);