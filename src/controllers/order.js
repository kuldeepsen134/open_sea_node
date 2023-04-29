const Orders = require("../models/order")
const Users = require('../models/user');

const { StatusCodes } = require("http-status-codes")
const { getErrorMessage } = require("../helpers/errorHandler")
const { createToken, getExpiredate } = require("../helpers/helper")
const { BadRequestError, CustomError } = require("../errors");
const Plans = require("../models/plan");


const createOrder = async (req, res) => {
    try {

        const { status, plan_name, plan_id, total, api_name, invoice_id } = req.body

        const plan = await Plans.findOne({ _id: req.body.plan_id })

        const expireDate = getExpiredate(plan.type)

        const order = new Orders({
            status: 'pending',
            api_name,
            plan_name: plan.name,
            plan_id,
            total,
            userId: req.user._id,
            invoice_id,
            planExpireDate: expireDate,
        })

        order.save().then(async (data) => {
            const filter = { _id: data.userId }
            const update = { apikey: createToken() }

            const user = await Users.updateOne(filter, update, { new: true })

            res.status(StatusCodes.CREATED).json(data)
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

const getOrder = async (req, res) => {
    try {
        await Orders.find({ userId: req.user._id }).then(data => {

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


const findOne = async (req, res) => {
    try {
        await Orders.findOne({ _id: req.params.id }).then(async (data) => {
            const dt = await Plans.findOne({ _id: data.plan_id })
            const plan = {
                type: dt.type,
                limit: dt.limit,
                price: dt.price
            }

            const y = { plan, ...data._doc }

            res.status(StatusCodes.OK).json(y)
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

const updateOrder = async (req, res) => {
    try {
        const order = await Orders.findOne({ _id: req.body.order_id })

        const filter = { _id: order._id }

        const update = {
            status: req.body.isPayment === true ? 'processing' : 'pending',
            invoice_id: req.body.invoice_id,
        }

        Orders.updateOne(filter, update, { new: true })
            .then((result) => {
                res.send({
                    message: 'Oder update successfully'
                })
            })
            .catch((error) => {
                res.status(404).send({
                    message: error.message,
                    error,
                })
            })

    } catch (error) {
        res.status(404).send({
            message: error.message,
            error,
        })
    }
}

module.exports = { createOrder, getOrder, updateOrder, findOne }