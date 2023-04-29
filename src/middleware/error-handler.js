const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
   // console.log(err)
   let customError = {
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || "Something went wrong try again later",
   };
   if (err.name === "ValidationError") {
      customError.msg = Object.values(err.errors)
         .map((item) => item.message)
         .join(",");
      customError.statusCode = 400;
   } else if (err.code && err.code === 11000) {
      customError.msg = `Duplicate value entered for ${Object.keys(
         err.keyValue
      )} field, please choose another value`;
      customError.statusCode = 400;
   } else if (err.name === "CastError") {
      customError.msg = `No item found with id : ${err.value}`;
      customError.statusCode = 404;
   } else {
      return res.status(customError.statusCode).json({ errMsg: customError.msg });
   }
};

module.exports = errorHandler;