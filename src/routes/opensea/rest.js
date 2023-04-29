const express = require("express");
const router = express.Router();
const { getdata } = require("../../controllers/rest")

router.get("/*", getdata);

module.exports = router;