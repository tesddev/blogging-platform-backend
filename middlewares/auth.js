const jwt = require('jsonwebtoken');
const config = require('../config.js');

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

module.exports = authenticateToken;
