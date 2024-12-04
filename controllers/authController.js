
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const successStatusCode = process.env.successStatusCode || 200;
const badRequestResponseCode = process.env.badRequestResponseCode || 400

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (!name || !email) {
        return res.status(badRequestResponseCode).json({
            succeeded: false,
            message: "one or more field missing.",
            statusCode: badRequestResponseCode,
            resultData: null
        })
    }

    if (existingUser) {
        return res.status(badRequestResponseCode).json({
            succeeded: false,
            message: email + ` already exists.`,
            statusCode: badRequestResponseCode,
            resultData: null
        })
    }

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({
        succeeded: true,
        message: "Action was successful",
        statusCode: successStatusCode,
        resultData: "User registered"
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
            succeeded: true,
            message: "Action not successful",
            statusCode: badRequestResponseCode,
            resultData: "Invalid credentials"
        });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
};

module.exports = { register, login };