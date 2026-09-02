// Doctors routes
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, authorizeRole } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// @route GET /api/doctors
// @desc Get all doctors (filterable)
// @access Public
router.get('/', asyncHandler(async (req, res) => {
    const { facility_id, department, search } = req.query;

    let sql = `
        SELECT d.*, f.name as facility_name, f.type as facility_type
        FROM doctors d
        JOIN facilities f ON d.facility_id = f.id
        WHERE d.is_available = true AND f.is_active = true
    `;
    const params = [];
    let paramIndex = 1;

    if (facility_id) {
        sql += ` AND d.facility_id = $${paramIndex}`;
        params.push(facility_id);
        paramIndex++;
    }

    if (department) {
        sql += ` AND d.department ILIKE $${paramIndex}`;
        params.push(`%${department}%`);
        paramIndex++;
    }

    if (search) {
        sql += ` AND (d.name ILIKE $${paramIndex} OR d.department ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    sql += ' ORDER BY d.name';

    const result = await query(sql, params);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));

// @route GET /api/doctors/:id
// @desc Get single doctor details
// @access Public
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(`
        SELECT d.*, f.name as facility_name, f.type as facility_type, f.address
        FROM doctors d
        JOIN facilities f ON d.facility_id = f.id
        WHERE d.id = $1 AND d.is_available = true AND f.is_active = true
    `, [id]);

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    res.json({
        success: true,
        data: result.rows[0]
    });
}));

// @route POST /api/doctors
// @desc Create a new doctor (admin only)
// @access Private/Admin
router.post('/', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const { name, facility_id, department, qualification, phone } = req.body;

    if (!name || !facility_id || !department) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    const result = await query(
        `INSERT INTO doctors (name, facility_id, department, qualification, phone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, facility_id, department, qualification, phone]
    );

    res.status(201).json({
        success: true,
        data: result.rows[0]
    });
}));

// @route PUT /api/doctors/:id
// @desc Update doctor (admin only)
// @access Private/Admin
router.put('/:id', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, facility_id, department, qualification, phone, is_available } = req.body;

    const result = await query(
        `UPDATE doctors
         SET name = COALESCE($1, name),
             facility_id = COALESCE($2, facility_id),
             department = COALESCE($3, department),
             qualification = COALESCE($4, qualification),
             phone = COALESCE($5, phone),
             is_available = COALESCE($6, is_available),
             updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [name, facility_id, department, qualification, phone, is_available, id]
    );

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    res.json({
        success: true,
        data: result.rows[0]
    });
}));

// @route DELETE /api/doctors/:id
// @desc Delete doctor (admin only)
// @access Private/Admin
router.delete('/:id', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        'UPDATE doctors SET is_available = false, updated_at = NOW() WHERE id = $1 RETURNING id',
        [id]
    );

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('Doctor not found');
    }

    res.json({
        success: true,
        message: 'Doctor deactivated'
    });
}));

module.exports = router;