const {logger} = require("../helpers/helper")

const fun = (req,res, code = 400, error) => {
    if (!res) throw new Error("Please Provide response object");
    logger.error(`${code}- ${req.originalUrl} - ${req.method}-${error}`)
    res.status(code).json({ ...(typeof error === "string" ? { message: error, err: true } : { message: error.message, err: true }) })
}
module.exports = fun