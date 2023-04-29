const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
   {
      user_name: {
         type: String,
         minlength: 2,
         maxlength: 24,
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
      role: {
         type: String,
         required: [true, "role is required"],
         min: 2,
         max: 24,
      }
   },
   { timestamps: true }
);

AdminSchema.pre("save", async function () {
   const salt = await bcrypt.genSalt();
   this.password = await bcrypt.hash(this.password, salt);
});

AdminSchema.methods.createJWT = function () {
   return jwt.sign(
      { _id: this._id, user_name: this.user_name, email: this.email },
      process.env.JWT_SECRET,
      {
         expiresIn: process.env.JWT_LIFETIME,
      }
   );
};

AdminSchema.methods.comparePassword = async function (pw) {
   const isCorrect = await bcrypt.compare(pw, this.password);
   return isCorrect;
};
module.exports = mongoose.model("Admin", AdminSchema);