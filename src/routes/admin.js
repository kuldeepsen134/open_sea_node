const express = require("express");
const router = express.Router();
const adminActionsRouter = require("./admin/adminActions");
const authRouter = require("./admin/adminAuth");

const { authorizeAdmin } = require("../middleware/authorization");
router.get("/", (req, res) => {
    res.send("Admin Api")
})
router.use("/auth", authRouter);
router.use("/profile", authorizeAdmin, adminActionsRouter);


module.exports = router;