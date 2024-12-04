function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;
            
            if (!userRole) {
                return res.status(401).json({ error: 'Unauthorized: User role not found' });
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: 'Authorization failed', details: error.message });
        }
    };
}

module.exports = authorizeRoles;
