const Admin = require("../models/Admin");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, AuthenticationError } = require("../errors");

const register = async (req, res) => {
	try {
		let admin = await Admin.findOne({ email: req.body.email });
		if (admin) throw new BadRequestError("Admin already exists for this email");
		admin = await new Admin({ email: req.body.email, password: req.body.password, first_name: req.body.first_name, last_name: req.body.last_name, role: process.env.ADMIN_EMAIL === req.body.email ? "admin" : "subAdmin" }).save()
		const { _id, name, email } = admin;
		const token = admin.createJWT();
		res.cookie('t', token, { maxAge: 9000000200, httpOnly: true });
		res.status(StatusCodes.CREATED).json({
			_id,
			token,
			name,
			email,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: error.message });
	}

};

const login = async (req, res) => {

	const { email, password } = req.body;

	if (!email || !password) throw new BadRequestError("Please provide email and password");
	const admin = await Admin.findOne({ email: req.body.email });
	if (!admin) throw new NotFoundError("Admin doesn't exist");
	const isPasswordCorrect = await admin.comparePassword(req.body.password);
	if (!isPasswordCorrect) throw new AuthenticationError("It's Ezio's password!! Enter yours");

	const { _id, name, email: _email } = admin;
	const token = admin.createJWT();
	res.cookie('t', token, { maxAge: 9000000200, httpOnly: true });
	res.status(StatusCodes.OK).json({
		_id,
		token,
		email: _email,
		name,
	});

};

module.exports = { register, login };