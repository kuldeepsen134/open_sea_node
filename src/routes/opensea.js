const express = require("express");
const router = express.Router();
const rest = require("./opensea/rest")

// const authorizationMiddleware = require("../middleware/authorization");
router.use("/rest", rest)

module.exports = router;