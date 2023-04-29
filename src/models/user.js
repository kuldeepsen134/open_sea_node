const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        minlength: 2,
        maxlength: 24,
        default: null,
        unique: [true, "User Name can't be same"]
    },
    first_name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 2,
        maxlength: 24,
    },
    last_name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 2,
        maxlength: 24,
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ],
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
    },
    profile_image: {
        type: String,
        default: null
    },
    profile_image_url: {
        type: String,
        default: null
    },
    dob: {
        type: Date,
        default: null
    },
    location: {
        type: String,
        maxlength: 20,
        default: null
    },
    about: {
        type: String,
        maxlength: 200,
        default: null
    },
    count: {
        type: Number,
        default: 0
    },
    apikey: {
        type: String,
        default: null
    },
    token:{
        type: String,
        default: null
    },
    expiresAt:{
        type: Date,
        default: null
    },
    plan_id:{
        type: String,
        default: null
    },
    order_id:{
        type: String,
        default: null
    },
    user_suspend:{
        type: Boolean,
        default: false
    }
},
    { timestamps: true });
userSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.createJWT = function () {
    return jwt.sign(
        { id: this._id, user_name: this.user_name, email: this.email },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
};
userSchema.methods.comparePassword = async function (pw) {
    const isCorrect = await bcrypt.compare(pw, this.password);
    return isCorrect;
};
const Users = new mongoose.model("user", userSchema);
module.exports = Users;