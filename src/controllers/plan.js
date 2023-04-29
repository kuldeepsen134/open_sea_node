
const Plans = require("../models/plan")
const responseSuccess = require("../helpers/responseSuccess");
const responseError  = require("../helpers/responseError")


const { getErrorMessage } = require("../helpers/errorHandler")
const { createToken } = require("../helpers/helper")
const { BadRequestError, CustomError } = require("../errors")
const { StatusCodes } = require("http-status-codes")


const createPlan = async (req, res) => {

    try {
        const { name, limit, type, price, benifits  } = req.body

        const data = new Plans({
            name,
            limit,
            type,
            price,
            benifits
        })

        data.save().then(async (data) => {
            responseSuccess(req, res,StatusCodes.CREATED, data)
        }).catch(err => {
            responseError(req, res, StatusCodes.BAD_REQUEST , err)
        })

    }
    catch (error) {
        responseError(req, res, StatusCodes.INTERNAL_SERVER_ERROR , error)
    }
}

const getPlan = async (req, res) => {
    try {

        await Plans.find().then(data => {

            res.status(StatusCodes.OK).json(data)

        }).catch(err => {

            res.status(StatusCodes.BAD_REQUEST).json({
                err: err.message
            })

        })

    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        })
    }
}

const deletePlanById = async (req, res) => {
    try{

        const {id} = req.params
        if(id.length !== 24) {
            responseError(req, res, StatusCodes.NOT_FOUND , 'Please enter a valid plan id')
            return
        }

        const plan = await Plans.findOne({_id:id})
        if(!plan) {
            responseError(req, res, StatusCodes.NOT_FOUND, 'Plan not found')
            return
        }else{
            await Plans.deleteOne({_id: plan._id})
            responseSuccess(req, res, StatusCodes.OK, "Plan deleted successfully")
            return
        }

    }catch(error){
        responseError(req, res, StatusCodes.INTERNAL_SERVER_ERROR , error)
    }
}

const updatePlanById = async (req, res) => {
    try{

        const {id} = req.params
        const {price, limit, name} = req.body

        if(id.length !== 24) {
            responseError(req, res, StatusCodes.NOT_FOUND , 'Please enter a valid plan id')
            return
        }

        const plan = await Plans.findOne({_id:id})
        if(!plan) {
            responseError(req, res, StatusCodes.NOT_FOUND , 'Plan not found')
            return
        }
        
        await Plans.updateOne({_id:id},{ $set: { price, limit, name } })
        responseSuccess(req, res, StatusCodes.OK, "plan updated successfully")

    }catch(error){
        responseError(req, res, StatusCodes.INTERNAL_SERVER_ERROR , error)
    }
}

module.exports = { createPlan, getPlan, deletePlanById, updatePlanById}