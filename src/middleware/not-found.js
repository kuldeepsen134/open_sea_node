const {logger} = require("../helpers/helper")
const notFound = (req, res) =>{
    logger.error(`${404}- ${req.originalUrl} - ${req.method}-route not found`)
    res.status(404).json({ message: "Route does not exist" });
} 

module.exports = notFound;
