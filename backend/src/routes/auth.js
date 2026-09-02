// Authentication routes
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { protect } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

// @route POST /api/auth/register
// @desc Register a new user
// @access Public
router.post(
    '/register',
    [
        body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
        body('phone').trim().isLength({ min: 10, max: 15 }).withMessage('Phone must be 10-15 digits'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').optional().isIn(['citizen', 'health_worker', 'admin']).withMessage('Invalid role')
    ],
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0].msg);
        }

        const { name, phone, email, password, role = 'citizen', language = 'en' } = req.body;

        // Check if user exists
        const userExists = await query('SELECT id FROM users WHERE phone = $1 OR email = $2', [phone, email || null]);
        if (userExists.rows.length > 0) {
            res.status(400);
            throw new Error('User already exists with this phone/email');
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        const result = await query(
            `INSERT INTO users (name, phone, email, password_hash, role, language)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, phone, email, role, language, created_at`,
            [name, phone, email || null, passwordHash, role, language]
        );

        const user = result.rows[0];
        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        });
    })
);

// @route POST /api/auth/login
// @desc Authenticate user & get token
// @access Public
router.post(
    '/login',
    [
        body('phone').trim().notEmpty().withMessage('Phone is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            throw new Error(errors.array()[0].msg);
        }

        const { phone, password } = req.body;

        // Find user
        const result = await query(
            'SELECT * FROM users WHERE phone = $1 OR email = $1',
            [phone]
        );

        if (result.rows.length === 0) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        const user = result.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        const token = generateToken(user.id);

        delete user.password_hash;

        res.json({
            success: true,
            data: {
                user,
                token
            }
        });
    })
);

// @route GET /api/auth/me
// @desc Get current user
// @access Private
router.get('/me', protect, asyncHandler(async (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
}));

// @route POST /api/auth/logout
// @desc Logout (client-side token removal)
// @access Private
router.post('/logout', protect, asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
}));

module.exports = router;