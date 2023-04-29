const express = require("express");
const router = express.Router();
const { getApilist } = require("../controllers/api")

// const authorizationMiddleware = require("../middleware/authorization");
router.get("/api-list/read", getApilist)

module.exports = router;