const  axios  = require("axios")

const ApiNames = require("../models/apiName")
const api = require("../models/api")
const apiUsages = require("../models/apiUsage")

const { StatusCodes } = require("http-status-codes")
const { axiosClient } = require("../helpers/helper")

const responseSuccess = require("../helpers/responseSuccess");
const responseError  = require("../helpers/responseError")



const addApiName = async (req, res) => {
    try {
        const { name } = req.body
        const apiName = new ApiNames({
            name,
        })

        apiName.save().then(async (data) => {
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

const getApiName = async (req, res) => {
    try {
        await ApiNames.find().then(data => {
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

const findAllApi = async(req,res) => {
    try{
        const allApis = await api.find()
        responseSuccess(req,res, StatusCodes.OK, allApis)
    }catch(error){
        responseError(req,res, StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
}


const getApiResult = async (req,res) =>{
    try{
        const start = Date.now()
        const {apiname} = req.params
        const request = await api.findOne({name:apiname})
        
        const url = request.information.url
        const usage = await apiUsages.findOne({api_name: url})
        const respo = await axios.get(url)
       
        if(respo){  
            if(!usage) { await apiUsages.create({api_name: url, request : 1 , avg_response_time : `${Date.now()- start} ms`}) }
            else { await apiUsages.updateOne({api_name: url},{$set: {request: usage.request+1,avg_response_time : `${Date.now()- start} ms` } }  )}
            responseSuccess(req,res, StatusCodes.OK, respo.data)
            
        }else{  
            if(!usage) { await apiUsages.create({api_name: url, request : 1, errors: 1 , avg_response_time : `${Date.now()- start} ms`}) }
            else { await apiUsages.updateOne({api_name: url},{$set: {request: usage.request+1,errors: usage.errors+1,avg_response_time : `${Date.now()- start} ms` } }  )}
            responseError(req,res, StatusCodes.NOT_FOUND, 'Api is not working, Please try after some time')
        }

    }catch(error){
        responseError(req ,res, StatusCodes.INTERNAL_SERVER_ERROR, error)
    }
}


const apiUsingLimitors = async (req,res)=>{
    return axiosClient(`https://cat-fact.herokuapp.com/facts`,res)
}

const apiWeather = async (req,res)=>{
    const query = req.body.query
    if(!query || typeof query!== 'string'){
        res.status(StatusCodes.BAD_REQUEST).json({ err: "Please enter a valid query"})
        return
    }
    const url = `http://api.weatherstack.com/current
        ? access_key = 0051de4edda754d757651903f8df3e2f
        & query = ${query}`
    return axiosClient(url,res)
}

const apiGetCountryInfo = async (req,res)=>{
    const  country  = req.body.country
    if(!country || typeof country !== 'string'){
        res.status(StatusCodes.BAD_REQUEST).json({ err: "Please enter a valid query"})
        return
    }
    const url = 'https://restcountries.com/v3.1/name/'+country
    return axiosClient(url,res)
}

const apiGetProducts = async (req,res)=>{
    return axiosClient(`https://dummyjson.com/products`,res)
}

const getSingleProduct = async (req,res)=>{
    const number = req.body.number
    if(!number || typeof number !== 'number'){
        res.status(StatusCodes.BAD_REQUEST).json({ err: "Please enter a valid query"})
        return
    }
    const url = 'https://dummyjson.com/products/'+number
    return axiosClient(url,res)
}

const searchProduct = async (req,res)=>{
    const q = req.body.q
    if(!q || typeof q !== 'string'){
        res.status(StatusCodes.BAD_REQUEST).json({ err: "Please enter a valid query"})
        return
    }
    const url = `https://dummyjson.com/products/search?q=${q}`
    return axiosClient(url,res)
}

const getProductCategories = async (req,res)=>{
    const url = `https://dummyjson.com/products/categories`
    return axiosClient(url,res)
}

const getProductsOfCategory = async (req,res)=>{
    const q = req.body.q
    if(!q || typeof q !== 'string'){
        res.status(StatusCodes.BAD_REQUEST).json({ err: "Please enter a valid query"})
        return
    }
    const url = `https://dummyjson.com/products/category/${q}`
    return axiosClient(url,res)
}

module.exports = { addApiName, getApiName, apiUsingLimitors, apiWeather,
     apiGetCountryInfo, apiGetProducts, getSingleProduct, searchProduct, 
     getProductCategories, getProductsOfCategory, findAllApi, getApiResult };