const jwt = require("jsonwebtoken");
const multer = require("multer");

const path = require("path");
const BASE_PATH = __dirname

const { AuthenticationError } = require("../errors");

const authorizeAdmin = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new AuthenticationError("Authentication Invalid");
	}
	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		if (payload.email === process.env.ADMIN_EMAIL) {
			req.admin = { _id: payload._id, user_name: payload.user_name, email: payload.email };
			next();
		} else {
			throw new AuthenticationError("Authentication Invalid");
		}
	} catch (error) {
		throw new AuthenticationError("Authentication Invalid");
	}
};

const authorizeUser = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new AuthenticationError("Authentication Invalid");
	}
	const token = authHeader.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { _id: payload.id, user_name: payload.user_name, email: payload.email, };
		//console.log('req.user', req.user);
		next();
	} catch (error) {
		throw new AuthenticationError("Authentication Invalid");
	}
};

const fileUploader = async (req, res, next) => {

	const storage = multer.diskStorage({

		destination: function (req, file, cb) {

			cb(null, path.join(process.cwd(),'..',`../tmp`))
		},

		filename: function (req, file, cb) {
			cb(null, Date.now() + file.originalname)
		},
	})
	const fileFilter = (req, file, cb) => {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error('Please upload a valid image file'))
		}
		else {
			cb(null, true)
		}
	}
	const upload = multer({
		storage: storage,
		limits: { fileSize: 1024 * 1024 * 3 },
		fileFilter: fileFilter
	})

	upload.single("file")(req, res, next)

}
module.exports = { authorizeAdmin, authorizeUser, fileUploader };