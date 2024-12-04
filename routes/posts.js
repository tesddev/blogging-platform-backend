const express = require('express');
const authenticateToken = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');
const postRouter = express.Router();
const { getPost, createPost, getAllPosts } = require('../controllers/postController');

postRouter.post('/createPost', authenticateToken, authorizeRoles('Author', 'Admin'), createPost);
postRouter.get('/posts', getAllPosts);
postRouter.get('/posts/:id', getPost);

module.exports = postRouter;
