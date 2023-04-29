const express = require("express");
const { register, login } = require("../../controllers/adminAuth");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("../../errors")

router.get("/", (req, res) => {
    res.send("Admin Auth Api")
})

//router.post("/register", register);
router.post("/login", login);
router.get("/logout", (req, res) => {
    res.clearCookie("t");
    res.send("Logout Successfull")
});
router.get("/islogedIn", (req, res) => {
    const token = req.cookies.t
    console.log(token);
    if (!token) throw new AuthenticationError("Login Failed");
    try {
        const { id, name, email } = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ id, name, email, token })
    } catch (error) {
        console.log(error);
        throw new AuthenticationError("Login Failed");
    }
});

module.exports = router;
