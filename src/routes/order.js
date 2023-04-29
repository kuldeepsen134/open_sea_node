const { default: axios } = require("axios")
const express = require("express")
const router = express.Router()
const { createOrder, getOrder, updateOrder, findOne } = require('../controllers/order')
const { authorizeAdmin, authorizeUser } = require("../middleware/authorization")
const { limitor } = require("../middleware/limiter")


router.post("/order", authorizeUser, createOrder)

router.get("/getOrders", authorizeUser, getOrder)
router.get("/getOrders/:id", authorizeUser, findOne)

router.get("/cat_fact", authorizeUser, limitor, async function (req, res) {
    console.log('req>>>>.', req);
    const respo = await axios.get(`https://cat-fact.herokuapp.com/facts`)

    res.send(respo.data)
})


router.patch("/updateOrder", authorizeUser, updateOrder)


module.exports = router