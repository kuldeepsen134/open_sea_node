const Users = require("../models/user");
const Orders = require("../models/order");
const { StatusCodes } = require("http-status-codes");
const { getErrorMessage } = require("../helpers/errorHandler")
const { BadRequestError, NotFoundError, AuthenticationError, CustomError } = require("../errors");
const { createToken, sendMailer } = require("../helpers/helper");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const {logger} = require("../helpers/helper")

const register = async (req, res) => {
    try {
        let users = await Users.findOne({ email: req.body.email });
        if (users) throw new BadRequestError("User already exists for this email");

        users = await Users.create({ ...req.body })

        const { _id, email } = users;
        const token = users.createJWT();
        res.cookie('t', token, { maxAge: 9000000200, httpOnly: true });
        res.status(StatusCodes.CREATED).json({
            _id,
            token,
            email,
            message: "User succeffully registered."
        });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        });
    }

};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequestError("Please provide email and password");
    const users = await Users.findOne({ email: req.body.email });

    if (!users) throw new NotFoundError("User doesn't exist");
    const isPasswordCorrect = await users.comparePassword(req.body.password);
    if (!isPasswordCorrect) throw new AuthenticationError("It's Ezio's password!! Enter yours");

    const { _id, email: useremail } = users;
    const token = users.createJWT();
    res.cookie('t', token, { maxAge: 9000000200, httpOnly: true });
    res.status(StatusCodes.OK).json({
        _id,
        token,
        email: useremail,
    });
};

const deleteUser = async (req, res) => {
    const { id } = req.query;
    const deletedUser = await Users.deleteOne({ _id: id });
    if (deletedUser.deletedCount === 0) throw new CustomError("No user deleted");
    logger.info(`userId: ${id}- statusCode: ${StatusCodes.OK}-url: ${req.originalUrl}`)
    res.status(StatusCodes.OK).json(deletedUser);
}
const refresh = (req, res) => {
}

const me = async (req, res) => {
    await Users.findOne({ _id: req.user._id }).then(data => {
        logger.info(`userId: ${req.user._id}- statusCode: ${StatusCodes.OK}-url: ${req.originalUrl}`)
        res.send(data)
    }).catch(err => {
        logger.error(`userId: ${req.user._id}- statusCode: ${StatusCodes.BAD_GATEWAY}-url: ${req.originalUrl}- error: ${err.message}`);
        res.status(StatusCodes.BAD_GATEWAY).send({
            message: err.message,
            error: true
        })
    })
}

const forgot = async (req, res) => {
    try {
        const email = req.body.email
        if (!email) return res.status(StatusCodes.BAD_REQUEST).json("Please enter email")
        const ifEmailExist = await Users.findOne({ email: email })

        if (!ifEmailExist) {
            res.status(StatusCodes.NOT_FOUND).json("Please enter valid email")
            return
        }

        let lastUpdate = Number(ifEmailExist.expiresAt)
        let token

        if (lastUpdate > Date.now() && ifEmailExist.token) token = ifEmailExist.token
        else {
            token = createToken()
            await Users.updateOne({ _id: ifEmailExist._id }, { $set: { token: token, expiresAt: Date.now() + 30 * 60 * 1000 } })
        }
        const message = await ejs.renderFile(path.join(__dirname, '../../views/mail.ejs'), { name: ifEmailExist.first_name, token: token });
        sendMailer(email, "Reset your password", message, res)
        logger.info(`statusCode: ${StatusCodes.OK}-url: ${req.originalUrl}`)
        res.status(StatusCodes.OK).json("Please Check Your Mail")
        return

    } catch (err) {logger.error(`userId: ${req.user._id}- statusCode: ${StatusCodes.INTERNAL_SERVER_ERROR}-url: ${req.originalUrl}- error: ${err.message}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: err.message
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const token = req.query.token
        const user = await Users.findOne({ token: token })

        if (!user) return res.status(StatusCodes.BAD_REQUEST).json("Expired link")

        let lastUpdate = Number(user.expiresAt)
        if (lastUpdate < Date.now()) {
            await Users.updateOne({ _id: user._id }, { $set: { token: null, expiresAt: null } })
            res.status(StatusCodes.BAD_REQUEST).json("Expired link")
            return
        }

        if (req.body.password.length < 6) {
            res.status(StatusCodes.BAD_REQUEST).json("Password validation is at least 6 character")
            return
        }

        const isPasswordCorrect = await user.comparePassword(req.body.password);
        if (isPasswordCorrect) {
            res.status(StatusCodes.BAD_REQUEST).json("You used this password recently. Please choose a different one.")
            return
        }

        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(req.body.password, salt)

        await Users.updateOne({ _id: user._id }, { $set: { password: password, token: null, expiresAt: null } })
        logger.info(`userId: ${user._id}- statusCode: ${StatusCodes.OK}-url: ${req.originalUrl}`)

        res.status(StatusCodes.OK).json("Password Reset Sucessfully.")
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: err.message
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.user._id })

        if (!user) { throw new BadRequestError("User doesn't exist") }
        const { user_name, about, location } = req.body;


        await Users.updateOne({ _id: req.user._id }, { $set: { user_name, about, location } })
        logger.info(`userId: ${req.user._id}- statusCode: ${StatusCodes.OK}-url: ${req.originalUrl}`)
        res.status(StatusCodes.OK).json("Profile Updated")
        return

    } catch (error) {
        logger.error(`userId: ${req.user._id}- statusCode: ${StatusCodes.BAD_GATEWAY}-url: ${req.originalUrl}- error: ${error.message}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { oldpassword, newpassword, confirmpassword } = req.body
        const user = await Users.findOne({ _id: req.user._id })

        if (!user) { throw new BadRequestError("User doesn't exist") }
        const isPasswordCorrect = await user.comparePassword(oldpassword);
        if (!isPasswordCorrect) throw new AuthenticationError("It's Ezio's password!! Enter yours");

        if (newpassword.length < 6) {
            res.status(StatusCodes.BAD_REQUEST).json("Password validation is at least 6 character")
            return
        }
        if (newpassword !== confirmpassword) {
            res.status(StatusCodes.BAD_REQUEST).json("New password and conform password must be same")
            return
        }

        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(newpassword, salt);

        await Users.updateOne({ _id: req.user._id }, { $set: { password: password } })
        logger.info(`userId: ${req.user._id}- statusCode: ${StatusCodes.OK}-url: ${req.originalUrl}`)
        res.status(StatusCodes.OK).json("Password Updated")
        return

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        });
    }

}

const updateProfileImage = async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.user._id })
        if (!user) { throw new BadRequestError("User doesn't exist") }

        let profile_image
        if (req.file) { profile_image = `${req.file.filename}` }
        else { profile_image ? profile_image : null }

        await Users.updateOne({ _id: req.user._id }, { $set: { profile_image, profile_image_url: `/tmp/${req.file.filename}` } })
        logger.info(`userId: ${req.user._id}- statusCode: ${StatusCodes.OK}-url: ${req.originalUrl}`)
        res.status(StatusCodes.OK).send({ message: "Profile Updated" })
        return

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        });
    }

}

const deleteDeletemyPlan = async (req, res) => {
    try {
        const user = await Users.findOne({ _id: req.user._id })
        if (!user) { throw new BadRequestError("User doesn't exist") }
        if (!user.plan_id) { throw new BadRequestError("User doesn't have valid plan") }
        if (!user.order_id) { throw new BadRequestError("User doesn't have valid plan") }

        await Orders.updateOne({ _id: user.order_id }, { $set: { status: "cancelled" } })
        await Users.updateOne({ _id: req.user._id }, { $set: { plan_id: null, apikey: null, count: null, order_id: null } })

        logger.info(`userId: ${req.user._id}- statusCode: ${StatusCodes.OK}-url: ${req.originalUrl}`)
        res.status(StatusCodes.OK).json("Plan Deleted")
        return
    } catch (error) {
        logger.error(`userId: ${req.user._id}- statusCode: ${StatusCodes.INTERNAL_SERVER_ERROR  }-url: ${req.originalUrl}- error: ${err.message}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            err: error.message
        });
    }
}

module.exports = {
    register, login, deleteUser, refresh, me, forgot,
    resetPassword, updateProfile, updatePassword, updateProfileImage, deleteDeletemyPlan
};