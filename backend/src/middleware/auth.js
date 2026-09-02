// Authentication middleware
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { query } = require('../config/database');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const user = await query(
                'SELECT id, name, phone, email, role, language, created_at FROM users WHERE id = $1',
                [decoded.id]
            );

            if (user.rows.length === 0) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            req.user = user.rows[0];
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

// Role middleware
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`Not authorized as role: ${req.user.role}`);
        }
        next();
    };
};

// Rate limiter for auth attempts
const authLimiter = (req, res, next) => {
    // In production, this would use Redis
    next();
};

module.exports = { protect, authorizeRole, authLimiter };