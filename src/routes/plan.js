const express = require("express")

const router = express.Router()

const { createPlan, getPlan, deletePlanById, updatePlanById } = require("../controllers/plan")
const { authorizeAdmin } = require("../middleware/authorization");

router.post("/plan", authorizeAdmin,createPlan)

router.delete("/plan/delete/:id", authorizeAdmin, deletePlanById)

router.patch("/plan/update/:id", authorizeAdmin, updatePlanById)

router.get("/plans", getPlan)

module.exports = router