const express = require('express');
const authRouter = express.Router();
const { register, login, requestPasswordReset, resetPassword } = require('../controllers/authController')

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/request-password-reset', requestPasswordReset);
authRouter.post('/reset-password/:token', resetPassword);

module.exports = authRouter;
