// Notifications routes
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// @route GET /api/notifications
// @desc Get user notifications
// @access Private
router.get('/', protect, asyncHandler(async (req, res) => {
    const { limit = 50, unread_only = false } = req.query;

    let sql = `
        SELECT id, title, message, type, is_read, related_id, created_at
        FROM notifications
        WHERE user_id = $1
    `;
    const params = [req.user.id];

    if (unread_only === 'true') {
        sql += ' AND is_read = false';
    }

    sql += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await query(sql, params);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));

// @route GET /api/notifications/unread-count
// @desc Get unread notification count
// @access Private
router.get('/unread-count', protect, asyncHandler(async (req, res) => {
    const result = await query(
        'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
        [req.user.id]
    );

    res.json({
        success: true,
        data: { count: parseInt(result.rows[0].count) }
    });
}));

// @route PUT /api/notifications/:id/read
// @desc Mark notification as read
// @access Private
router.put('/:id/read', protect, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, req.user.id]
    );

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('Notification not found');
    }

    res.json({
        success: true,
        message: 'Notification marked as read'
    });
}));

// @route PUT /api/notifications/read-all
// @desc Mark all notifications as read
// @access Private
router.put('/read-all', protect, asyncHandler(async (req, res) => {
    await query(
        'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
        [req.user.id]
    );

    res.json({
        success: true,
        message: 'All notifications marked as read'
    });
}));

// @route DELETE /api/notifications/:id
// @desc Delete notification
// @access Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, req.user.id]
    );

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('Notification not found');
    }

    res.json({
        success: true,
        message: 'Notification deleted'
    });
}));

module.exports = router;