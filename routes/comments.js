const express = require('express');
const commentRouter = express.Router();
const { authenticateToken, isAuthorized } = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');
const postComment = require('../controllers/commentController');

commentRouter.post('/postComment', authenticateToken, postComment);

module.exports = commentRouter;
