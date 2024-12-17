const jwt = require('jsonwebtoken');
const config = require('../config.js');
const Post = require('../models/post');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            responseCode: 0,
            responseMessage: "Authorization token is missing",
        });
    }
  
    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({
                responseCode: 0,
                responseMessage: "Invalid or expired token",
            });
        }
        req.user = user;
        next();
    });
}

const isAuthorized = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.authorId.toString() === req.user.id || req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: "You are not authorized to perform this action" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Authorization failed', details: error.message });
    }
};

module.exports = { authenticateToken, isAuthorized };
