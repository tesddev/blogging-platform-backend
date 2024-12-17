
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const successStatusCode = process.env.successStatusCode || 200;
const badRequestResponseCode = process.env.badRequestResponseCode || 400
const transporter = require('../config/nodemailer');
const crypto = require('crypto');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (!name || !email) {
        return res.status(badRequestResponseCode).json({
            succeeded: false,
            message: "One or more fields missing.",
            statusCode: badRequestResponseCode,
            resultData: null
        });
    }

    if (existingUser) {
        return res.status(badRequestResponseCode).json({
            succeeded: false,
            message: email + " already exists.",
            statusCode: badRequestResponseCode,
            resultData: null
        });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ 
        name, 
        email, 
        password: hashedPassword, 
        role 
    });

    await user.save();
    res.status(201).json({
        succeeded: true,
        message: "Action was successful",
        statusCode: successStatusCode,
        resultData: "User registered"
    });
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

    res.status(200).json({
        succeeded: true,
        message: "Login successful.",
        statusCode: 200,
        resultData: token,
    });
};

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                succeeded: false,
                message: "User not found",
                statusCode: 404,
                resultData: null,
            });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        await transporter.sendMail({
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset</p>
                   <p>Use this token <h3>${resetToken}</h3> to reset your password.</p>`
        });

        res.status(200).json({
            succeeded: true,
            message: "Password reset email sent!",
            statusCode: 200,
            resultData: true,
        });
    } catch (err) {
        res.status(500).json({
            succeeded: false,
            message: "Error processing request",
            statusCode: 500,
            resultData: error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                succeeded: false,
                message: "Invalid or expired token.",
                statusCode: 400,
                resultData: null,
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        console.log(`see final pass used ${password} and hashed ${user.password}`)

        await user.save();
        console.log(`see saved user ${user}`)

        res.status(200).json({
            succeeded: true,
            message: "Password reset successful.",
            statusCode: 200,
            resultData: null,
        });
    } catch (err) {
        res.status(500).json({
            succeeded: false,
            message: "Error resetting password.",
            statusCode: 500,
            resultData: error.message,
        });
    }
};


module.exports = { register, login, requestPasswordReset, resetPassword };