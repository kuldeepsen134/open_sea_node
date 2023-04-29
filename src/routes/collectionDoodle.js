const express = require("express");
const { test } = require("../controllers/collectionDoodle");
const { checkLimit } = require("../middleware/limiter");
const router = express.Router();


router.get("/collection/doodles-official/stats/:apikey", checkLimit,test);

module.exports = router;