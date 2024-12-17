const express = require('express');
const { authenticateToken, isAuthorized } = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');
const postRouter = express.Router();
const { getPost, createPost, getAllPosts, editPost, deletePost } = require('../controllers/postController');

postRouter.post('/createPost', authenticateToken, authorizeRoles('Author', 'Admin'), createPost);
postRouter.get('/posts', getAllPosts);
postRouter.get('/posts/:id', getPost);
postRouter.put('/posts/:id', authenticateToken, isAuthorized, editPost);
postRouter.delete('/posts/:id', authenticateToken, isAuthorized, deletePost);

module.exports = postRouter;