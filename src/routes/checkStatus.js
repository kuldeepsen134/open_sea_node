const express = require("express")
const { create, findAll } = require("../controllers/checkStatus")
const router = express.Router()


router.post("/checkStatus", create)
router.get("/checkStatus", findAll)


module.exports = router