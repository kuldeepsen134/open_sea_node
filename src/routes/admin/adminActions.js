const express = require("express");
const router = express.Router();
const { getProfile, getNumbersOfUsers, getRevenue,
     updateUserProfile, deleteByAdmin, profileByAdmin,
     infoByAdmin, addApi, updateApi, deleteApiById,
     getApiUsage, getAllLogs } = require("../../controllers/admin")
const { register } = require('../../controllers/user')

router.get("/me", getProfile);
router.get("/getNumbersOfUsers", getNumbersOfUsers);
router.get("/getRevenue", getRevenue)
router.get("/getApiUsage", getApiUsage)

router.post('/user/registerByAdmin', register)
router.patch('/user/updateByAdmin/:id', updateUserProfile)
router.delete('/user/deleteByAdmin/:id', deleteByAdmin)
router.get('/user/profileByAdmin/:id', profileByAdmin)
router.get('/users/infoByAdmin', infoByAdmin)

router.post('/addApi', addApi)
router.patch('/updateApi/:id', updateApi)
router.delete('/deleteApi/:id', deleteApiById)

router.get('/allLogs', getAllLogs)
module.exports = router; 