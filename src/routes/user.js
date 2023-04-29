const express = require("express");
const router = express.Router();
const userRouter = require("./user/userAuth")
// const authorizationMiddleware = require("../middleware/authorization");

router.use("/auth", userRouter);

module.exports = router;