'use strict';
const api = require("../models/api")
const responseErr = require("../helpers/responseError")
const responseSuccess = require("../helpers/responseSuccess")



const addApi = async (req, res) => {
    try {
        const result = await new api({
            ...req.body
        }).save();
        if (!result) return responseErr(req, res, 400, {
            message: "Not saved"
        })
        responseSuccess(req, res, 201, result)
    } catch (error) {
        console.log(error);
        responseErr(req, res, 400, error)
    }
}
const getApilist = async (req, res) => {
    try {
        if (Object.keys(req.query).length === 0 && req.query.constructor === Object) throw ("Provide Query")
        const result = await api.find(req.query)
        if (!result.length) throw ("Not Found")
        responseSuccess(req, res, 200, result)
    } catch (error) {
        console.error(error);
        responseErr(req, res, 404, error)
    }
}
module.exports = { getApilist, addApi }