const express = require('express');
const commentRouter = express.Router();
const { authenticateToken, isAuthorized } = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');
const {postComment, deleteComment} = require('../controllers/commentController');

commentRouter.post('/postComment', authenticateToken, postComment);
commentRouter.delete('/deleteComment/:id', authenticateToken, authorizeRoles('Admin'), deleteComment);

module.exports = commentRouter;
