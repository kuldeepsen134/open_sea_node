const express = require("express");
const router = express.Router();
const path = require("path");


router.get("/:name",(req,res) => {
	const { name } = req.params
	const newPath = path.join(process.cwd(),'..',`../tmp/${name}`)
	res.sendFile( newPath ,function (err) {
	    if (err) {
	        console.log(err)
	    } else {
	        console.log('Sent:', newPath);
	    }
	})
})

module.exports = router;