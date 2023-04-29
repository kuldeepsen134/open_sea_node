const { RateLimiterMongo, RateLimiterMemory } = require('rate-limiter-flexible');
const Users = require('../models/user');
const { StatusCodes } = require("http-status-codes")
const x = []

const limitor = async (req, res, next) => {

    if (req.baseUrl.includes('/login') || req.baseUrl.includes('/register') || req.baseUrl.includes('/api/order')) return next()

    var userCount = 0;
    userCount = userCount + 1;
    x.push(userCount)
    console.log(' req.user>>>>>>>>>', req.user);
    const user = await Users.findOne({ _id: req.user._id })
    if (req.headers.apikey) {
        const users = await Users.findOne({ apikey: req.headers.apikey, _id: req.user._id })
        return next()
    }

    if (user.count > 0) {
        const filter = { _id: req.user._id }
        const update = { count: user.count - 1 }
        Users.updateOne(filter, update)
            .then((result) => {
                return next()
            })
            .catch((error) => {
                res.status(404).send({
                    message: "User not found",
                    error,
                })
            })
    }
    else {
        res.status(400).send({
            message: "You have no credit api's hits. Please upgrade your plan",
        })
    }

}

const checkLimit = async (req,res,next) => {
    try{
        const apikey = req.params.apikey
        const user = await Users.findOne({apikey: apikey})

        if(!user) {
            res.status(404).send('invali apikey')
            return
        }
        
        if(user.count > 0){
            const filter = { _id: user._id }
            const update = { count: user.count - 1 }
            await Users.updateOne(filter, update)
            next()
        }else{
            await Users.updateOne({apikey: req.apikey},{$set:{plan_id: null, apikey: null}})
            res.status(402).json({message:"please purchase a subscription!"})
        }

    }catch(error){
        res.status(StatusCodes.BAD_REQUEST).json({
            err: err.message
        })
    }
}

module.exports = { limitor, checkLimit }