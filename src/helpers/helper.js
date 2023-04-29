const nodemailer = require('nodemailer')
const  axios  = require("axios")

const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const { StatusCodes } = require("http-status-codes")

const createToken = () => {
    var dt = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}


const getExpiredate = (type) => {

    var date = new Date() // Get current date

    if (type === 'silver') {
        date.setDate(date.getDate() + 30) // Set now + 30 days as the new date
        return date
    } else
        if (type === 'gold') {
            date.setDate(date.getDate() + 60) // Set now + 30 days as the new date
            return date
        }
        else
            if (type === 'diamond') {
                date.setDate(date.getDate() + 90) // Set now + 30 days as the new date
                return date
            }
    return date
}

const sendMailer = async (email, subject, message, res) => {

    const transporter = nodemailer.createTransport({
        host: `${process.env.SMPT_EMAIL_HOST}`,
        port: `${process.env.SMPT_EMAIL_PORT}`,
        auth: {
            user: `${process.env.SMPT_EMAIL_USER}`,
            pass: `${process.env.SMPT_EMAIL_PASSWORD}`
        },
    })

    const data = {
        from: `${process.env.SMPT_EMAIL_FROM}`,
        to: `${email}`,
        subject: `${subject} - Opensea`,
        html: `${message}`,
    }

    transporter.sendMail(data, (error, info) => {
        if (error) {
            console.log('error>>>>>>', error);
            res.status(error.responseCode).send(error)
            return 
            
        }
    })

    return
}

const axiosClient = async (url,res) => {
    try{
        const respo = await axios.get(url)

        if(respo){
            res.status(StatusCodes.OK).json({ 'responce':respo.data })
            return
        }else{
            res.status(StatusCodes.NOT_FOUND).json({ 'error':"Api is not working, Please try after some time" })
            return
        }
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        return
    }
}

const logger = createLogger({
    transports:[
        new transports.MongoDB({
            level:'error',   
            db : process.env.DB_URI,
            options: {
                useUnifiedTopology: true
            },
            collection: 'logs',
            expireAfterSeconds: 1800,
            format: format.combine(
            format.timestamp(),
            
            format.json())
        }),
        new transports.MongoDB({
            level:'info',   
            db : process.env.DB_URI,
            options: {
                useUnifiedTopology: true
            },
            collection: 'logs',
            expireAfterSeconds: 10,
            format: format.combine(
            format.timestamp(),
                
            format.json())
        }),
    ]
    });


module.exports = { createToken, getExpiredate, sendMailer, axiosClient, logger }