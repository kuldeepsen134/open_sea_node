const Admin = require("../models/Admin");
const Orders = require("../models/order");
const Users = require("../models/user");
const api = require("../models/api");
const apiUsage = require("../models/apiUsage")
const server_logs = require("../models/server_logs")

const responseSuccess = require("../helpers/responseSuccess")
const responseError  = require("../helpers/responseError")

const { StatusCodes } = require("http-status-codes");

const getProfile = async (req, res) => {
    await Admin.findOne({ _id: req.admin._id }).then(data => {
        responseSuccess(req,res,StatusCodes.OK,data);
    }).catch(err => {
        responseError(req,res, StatusCodes.BAD_GATEWAY, err)
    })
}

const getNumbersOfUsers = async(req,res) =>{
    try{
        const users = await Users.find()
        const userData = []
            for(let user= 0 ; user < users.length ; user++){
                let date = users[user].createdAt
                let month = date.getUTCMonth() + 1
                let year = date.getUTCFullYear()
                let key = `${month}-${year}`
                let value = {time:key}
                userData.push(value)
            }

            const updatedList = Object.values(userData.reduce(
                (map, el) => {
                  map[el.time] ? map[el.time].active_users++ : map[el.time] = { ...el,
                    active_users: 1
                  };
                  return map;
                }, {}
              ));
                
    responseSuccess(req,res,200,updatedList)
        
    }catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: error.message });
	}
}

const getRevenue = async (req,res) => {
    try{
         const getConfirmedOrders = await Orders.find({status : 'confirmed'})
         const userData = []
         for(let order= 0 ; order < getConfirmedOrders.length ; order ++){
             let date = getConfirmedOrders[order].createdAt
             let amount= Number(getConfirmedOrders[order].total)
             let month = date.getUTCMonth() + 1
             let year = date.getUTCFullYear()
             let key = `${month}-${year}`
             let value = {time:key, revenue:amount}
             userData.push(value)
         }

         const getRevenueMonthly = Array.from(userData.reduce(
            (m,{time,revenue})=> m.set(time,(m.get(time) || 0) + revenue),
            new Map),([time,revenue]) =>({time,revenue}))   
    
        responseSuccess(req,res,200,getRevenueMonthly)
    }catch (error) {
        console.log(error)
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: error.message });
	}
}
// app api information
const getApiUsage = async (req, res) => {

    try{
        const apiDetails = await apiUsage.find()
        responseSuccess(req,res, StatusCodes.OK, apiDetails)
    } catch (error) {
        responseError(req,res, StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
}


const updateUserProfile = async (req, res) => {
    try {
        const {id} = req.params
        if(id.length !== 24) {
            res.status(StatusCodes.NOT_FOUND).json( 'Please enter a valid user id')
            return
        }
        const user = await Users.findOne({ _id: id })

        if (!user) { throw new BadRequestError("User doesn't exist") }
        const { user_name, about, location, user_suspend } = req.body;


        await Users.updateOne({ _id: id }, { $set: { user_name, about, location, user_suspend } })
        res.status(StatusCodes.OK).json("Profile Updated")
        return

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        });
    }
}

const deleteByAdmin = async (req, res) => {
    try{
        const {id} = req.params
        if(id.length !== 24) {
            res.status(StatusCodes.NOT_FOUND).json( 'Please enter a valid user id')
            return
        }

        const user = await Users.findOne({ _id: id })
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({message: "User does not exist"})
            return
        }

        await Users.findByIdAndDelete({_id:id})
        res.status(StatusCodes.OK).json({message: "User deleted successfully"})

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        });
    }

}

const profileByAdmin = async (req, res) => {

    const {id} = req.params
    if(id.length !== 24) {
        res.status(StatusCodes.NOT_FOUND).json( 'Please enter a valid user id')
        return
    }

    const user = await Users.findOne({ _id: id })
    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({message: "User does not exist"})
        return
    }

    await Users.findOne({ _id: id }).then(data => {
        res.send(data)
    }).catch(err => {
        res.status(StatusCodes.BAD_GATEWAY).send({
            message: err.message,
            error: true
        })
    })
}

const infoByAdmin = async (req,res) => {
    
    try{
        const users = await Users.find()
        res.status(StatusCodes.OK).json(users)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        }); 
    }
    
}
// create new api by admin
const addApi = async (req, res) => {
    try{
        const newApi =await api.create({ ...req.body })
        responseSuccess(req, res, StatusCodes.OK, newApi)

    }catch(error){
        responseError(req, res, StatusCodes.INTERNAL_SERVER_ERROR , error)
    }
}
// update existing api
const updateApi = async (req, res) => {
    try{
        const _id = req.params.id
        const isApiExixt = await api.findOne({_id: _id})
        if(isApiExixt) {
            await api.updateOne({_id: _id},{$set: req.body})
            responseSuccess(req, res, StatusCodes.OK, 'Api update successfully')
        }else{
            responseError(req, res, StatusCodes.NOT_FOUND, 'Api does not exist')
        }

    }catch(error){
        responseError(req, res, StatusCodes.INTERNAL_SERVER_ERROR , error)
    }
}

// delete api by id
const deleteApiById = async (req, res) => {
    try{
        const id = req.params.id
        const isApiExixt = await api.findOne({_id: id})
        if(isApiExixt){
            await api.deleteOne({_id: id})
            responseSuccess(req, res, StatusCodes.OK, 'Api deleted successfully')
        }else{
            responseError(req, res, StatusCodes.NOT_FOUND, 'Api not found')
        }
    }catch(error){
        responseError(req, res, StatusCodes.INTERNAL_SERVER_ERROR , error)
    }
}

// get all Logs
const getAllLogs = async (req,res) => {
    try{
        const logs = await server_logs.find()   
        responseSuccess(req, res, StatusCodes.OK, logs )
    }catch(error){
        responseError(req, res, StatusCodes.INTERNAL_SERVER_ERROR , error)
    }
}


module.exports = { getProfile, getNumbersOfUsers, getRevenue,
     updateUserProfile,deleteByAdmin, profileByAdmin, infoByAdmin,
      addApi, updateApi, deleteApiById, getApiUsage, getAllLogs };