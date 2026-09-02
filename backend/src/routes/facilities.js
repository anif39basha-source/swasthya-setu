// Facilities routes
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, authorizeRole } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// Calculate distance between two coordinates (in km) using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// @route GET /api/facilities
// @desc Get all healthcare facilities
// @access Public
router.get('/', asyncHandler(async (req, res) => {
    const { type, district, lat, lng, search } = req.query;

    let sql = `
        SELECT f.*, l.district, l.state, l.name as location_name,
               (SELECT COUNT(*) FROM doctors WHERE facility_id = f.id AND is_available = true) as available_doctors,
               (SELECT json_agg(service_name) FROM facility_services WHERE facility_id = f.id AND is_available = true) as services
        FROM facilities f
        LEFT JOIN locations l ON f.location_id = l.id
        WHERE f.is_active = true
    `;
    const params = [];
    let paramIndex = 1;

    if (type) {
        sql += ` AND f.type = $${paramIndex}`;
        params.push(type);
        paramIndex++;
    }

    if (district) {
        sql += ` AND l.district ILIKE $${paramIndex}`;
        params.push(`%${district}%`);
        paramIndex++;
    }

    if (search) {
        sql += ` AND f.name ILIKE $${paramIndex}`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    sql += ' ORDER BY f.name';

    const result = await query(sql, params);

    let facilities = result.rows;

    // Calculate distance if user location provided
    if (lat && lng) {
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        facilities = facilities.map(f => ({
            ...f,
            distance: parseFloat(calculateDistance(userLat, userLng, parseFloat(f.latitude), parseFloat(f.longitude)).toFixed(2))
        }));
        facilities.sort((a, b) => a.distance - b.distance);
    }

    res.json({
        success: true,
        count: facilities.length,
        data: facilities
    });
}));

// @route GET /api/facilities/nearby
// @desc Get nearby facilities based on user location
// @access Public
router.get('/nearby', asyncHandler(async (req, res) => {
    const { lat, lng, radius = 50 } = req.query;

    if (!lat || !lng) {
        res.status(400);
        throw new Error('Latitude and longitude are required');
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const result = await query(`
        SELECT f.*, l.district, l.state,
               (SELECT COUNT(*) FROM doctors WHERE facility_id = f.id AND is_available = true) as available_doctors,
               (SELECT json_agg(service_name) FROM facility_services WHERE facility_id = f.id AND is_available = true) as services
        FROM facilities f
        LEFT JOIN locations l ON f.location_id = l.id
        WHERE f.is_active = true
    `);

    const facilitiesWithDistance = result.rows
        .map(f => {
            const distance = calculateDistance(userLat, userLng, parseFloat(f.latitude), parseFloat(f.longitude));
            return { ...f, distance: parseFloat(distance.toFixed(2)) };
        })
        .filter(f => f.distance <= parseFloat(radius))
        .sort((a, b) => a.distance - b.distance);

    res.json({
        success: true,
        count: facilitiesWithDistance.length,
        data: facilitiesWithDistance
    });
}));

// @route GET /api/facilities/:id
// @desc Get single facility with full details
// @access Public
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const facilityResult = await query(`
        SELECT f.*, l.district, l.state
        FROM facilities f
        LEFT JOIN locations l ON f.location_id = l.id
        WHERE f.id = $1 AND f.is_active = true
    `, [id]);

    if (facilityResult.rows.length === 0) {
        res.status(404);
        throw new Error('Facility not found');
    }

    const facility = facilityResult.rows[0];

    // Get doctors
    const doctors = await query(
        'SELECT id, name, department, qualification, is_available FROM doctors WHERE facility_id = $1 ORDER BY name',
        [id]
    );

    // Get services
    const services = await query(
        'SELECT service_name, is_available FROM facility_services WHERE facility_id = $1',
        [id]
    );

    // Get medicine availability (limited to 10 most common)
    const medicines = await query(`
        SELECT m.name, mi.quantity, mi.status
        FROM medicine_inventory mi
        JOIN medicines m ON mi.medicine_id = m.id
        WHERE mi.facility_id = $1
        ORDER BY m.name
        LIMIT 20
    `, [id]);

    res.json({
        success: true,
        data: {
            ...facility,
            doctors: doctors.rows,
            services: services.rows,
            medicines: medicines.rows
        }
    });
}));

// @route POST /api/facilities
// @desc Create a new facility (admin only)
// @access Private/Admin
router.post('/', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const { name, type, address, location_id, latitude, longitude, phone, email, opening_time, closing_time, emergency_available } = req.body;

    if (!name || !type || !address || !latitude || !longitude) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    const result = await query(
        `INSERT INTO facilities (name, type, address, location_id, latitude, longitude, phone, email, opening_time, closing_time, emergency_available)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [name, type, address, location_id, latitude, longitude, phone, email, opening_time, closing_time, emergency_available]
    );

    res.status(201).json({
        success: true,
        data: result.rows[0]
    });
}));

// @route PUT /api/facilities/:id
// @desc Update facility (admin only)
// @access Private/Admin
router.put('/:id', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, type, address, latitude, longitude, phone, email, opening_time, closing_time, emergency_available, is_active } = req.body;

    const result = await query(
        `UPDATE facilities
         SET name = COALESCE($1, name),
             type = COALESCE($2, type),
             address = COALESCE($3, address),
             latitude = COALESCE($4, latitude),
             longitude = COALESCE($5, longitude),
             phone = COALESCE($6, phone),
             email = COALESCE($7, email),
             opening_time = COALESCE($8, opening_time),
             closing_time = COALESCE($9, closing_time),
             emergency_available = COALESCE($10, emergency_available),
             is_active = COALESCE($11, is_active),
             updated_at = NOW()
         WHERE id = $12
         RETURNING *`,
        [name, type, address, latitude, longitude, phone, email, opening_time, closing_time, emergency_available, is_active, id]
    );

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('Facility not found');
    }

    res.json({
        success: true,
        data: result.rows[0]
    });
}));

// @route DELETE /api/facilities/:id
// @desc Delete facility (soft delete, admin only)
// @access Private/Admin
router.delete('/:id', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(
        'UPDATE facilities SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
        [id]
    );

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('Facility not found');
    }

    res.json({
        success: true,
        message: 'Facility deactivated'
    });
}));

module.exports = router;