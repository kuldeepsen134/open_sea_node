const { StatusCodes } = require("http-status-codes")
const { getErrorMessage } = require("../helpers/errorHandler")
const { createToken } = require("../helpers/helper")
const { BadRequestError, CustomError } = require("../errors")
const Transactions = require("../models/transaction")
const Orders = require("../models/order")
const Users = require("../models/user")
const Plans = require("../models/plan")



const createTransaction = async (req, res) => {
    try {
        const { orderId, } = req.body

        const order = await Orders.findOne({ _id: orderId })

        if (order === null) {
            return res.status(StatusCodes.BAD_REQUEST).json({ erro: 'Invalid OrderId' })
        }

        const transaction = new Transactions({
            userId: req.body.userId,
            orderId,
        })

        transaction.save().then(async (data) => {

            const plan = await Plans.findOne({ _id: order.plan_id })

            const filter = { _id: data.userId }

            let hits = 0

            if (plan.type === 'silver') {
                hits = 100
            } else
                if (plan.type === 'gold') {
                    hits = 200
                } else
                    if (plan.type === 'diamond') {
                        hits = 300
                    }

            const getUserdata = await Users.findOne({ _id: req.body.userId })

            const update = { count: hits + getUserdata.count }
            const opts = { new: true }

            const user = await Users.updateOne(filter, update, opts)

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

const getTransaction = async (req, res) => {
    try {
        await Transactions.find({ userId: req.user.id }).then(data => {
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

module.exports = { createTransaction, getTransaction }