const PaymentStatusChecks = require("../models/checkStatus")
const { StatusCodes } = require("http-status-codes")
const Orders = require("../models/order")
const Plans = require("../models/plan")
const Users = require("../models/user")
const { createToken } = require("../helpers/helper")



const create = async (req, res) => {
    try {
        const body = req.body

        if (body.data.status === 'confirmed' || body.data.status === 'complete') {

            const filter = { _id: body.data.orderId }
            const update = {
                status: 'confirmed',
            }

            await Orders.findOne({ _id: body.data.orderId }).then(async (data) => {

                Orders.updateOne(filter, update, { new: true })

                    .then(async (result) => {

                        const plan = await Plans.findOne({ _id: data.plan_id })

                        const filter = { _id: data.userId, }

                        const update = { apikey: createToken(), count: plan.limit, plan_id: data.plan_id, order_id: body.data.orderId}

                        const user = await Users.updateOne(filter, update, { new: true })

                        res.send({
                            message: 'Oder update success'
                        })
                    })
                    .catch((error) => {
                        res.status(404).send({
                            message: error.message,
                            error,
                        })
                    })



            }).catch(err => {

            })




        }


    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        })
    }
}

const findAll = async (req, res) => {
    try {
        await PaymentStatusChecks.find().then(data => {

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

// const updateOrder = async (req, res) => {
//     try {
//         const order = await Orders.findOne({ _id: req.body.order_id })

//         const filter = { _id: order._id }

//         const update = {
//             status: 'processing',
//         }

//         Orders.updateOne(filter, update, { new: true })
//             .then((result) => {
//                 res.send({
//                     message: 'Oder update success'
//                 })
//             })
//             .catch((error) => {
//                 res.status(404).send({
//                     message: error.message,
//                     error,
//                 })
//             })

//     } catch (error) {
//         res.status(404).send({
//             message: error.message,
//             error,
//         })
//     }
// }

module.exports = { create, findAll }