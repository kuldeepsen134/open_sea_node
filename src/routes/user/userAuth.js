const express = require("express");
const router = express.Router();
const { register, login, refresh, me, forgot,
    resetPassword,updateProfile, updatePassword,
    updateProfileImage, deleteDeletemyPlan } = require("../../controllers/user");
const { authorizeUser, fileUploader, } = require("../../middleware/authorization");

router.post("/register", register);
router.patch("/updateprofile", authorizeUser, updateProfile);
router.post("/login", login);
router.post("/forgot", forgot);
router.post("/reset", resetPassword);
router.post("/updatepassword",authorizeUser, updatePassword )
router.post("/updateprofileimage", authorizeUser, fileUploader,updateProfileImage)
router.delete("/deletemyplan",authorizeUser, deleteDeletemyPlan)

router.get("/me", authorizeUser, me);

router.get("/refresh", refresh);
router.get("/logout", (req, res) => {
    res.clearCookie("t");
    res.send("Logout Successfull")
});

module.exports = router;
