const express = require("express")
const router = express.Router()

const createApiName = require('../controllers/apiName')
const { checkLimit } = require("../middleware/limiter")

router.post("/addApiName", createApiName.addApiName)

router.get("/getApiName", createApiName.getApiName)

router.get('/allApi', createApiName.findAllApi)

router.get('/products/:apiname/:apikey',checkLimit, createApiName.getApiResult)


// Dummy routes
router.get("/apiwith/limitors/dummy/:apikey", checkLimit, createApiName.apiUsingLimitors )

router.post("/apiwith/limitors/weather/:apikey", checkLimit, createApiName.apiWeather )

router.post("/apiwith/limitors/country/:apikey", checkLimit, createApiName.apiGetCountryInfo )

router.get("/apiwith/limitors/product/:apikey", checkLimit, createApiName.apiGetProducts)

router.post("/apiwith/limitors/getsingleproduct/:apikey", checkLimit, createApiName.getSingleProduct )

router.post("/apiwith/limitors/searchproduct/:apikey", checkLimit, createApiName.searchProduct )

router.get("/apiwith/limitors/getproductcategories/:apikey", checkLimit, createApiName.getProductCategories )

router.post("/apiwith/limitors/getproductcategory/:apikey", checkLimit, createApiName.getProductsOfCategory )

module.exports = router