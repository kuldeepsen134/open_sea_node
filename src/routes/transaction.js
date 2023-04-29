const { default: axios } = require("axios")
const express = require("express")
const { createTransaction, getTransaction } = require("../controllers/transaction")
const router = express.Router()

const { authorizeAdmin, authorizeUser } = require("../middleware/authorization")
const { limitor } = require("../middleware/limiter")


router.use("/transaction", authorizeUser, createTransaction)

router.use("/transactions", authorizeUser, getTransaction)

module.exports = router