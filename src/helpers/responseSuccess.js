const {logger} = require("../helpers/helper")

const fun = (req,res, code = 200, data = null) => {
    if (!res) throw new Error("Please Provide response object");
    logger.info(`${code}- ${req.originalUrl} - ${req.method}-Success`)
    res.status(code).json({message: data, err: false})
}   
module.exports = fun    