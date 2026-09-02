// Referrals routes
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, authorizeRole } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// Generate referral ID
function generateReferralId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return `REF-${year}${month}${day}-${random}`;
}

// @route GET /api/referrals
// @desc Get referrals based on user role
// @access Private
router.get('/', protect, asyncHandler(async (req, res) => {
    let sql;
    let params = [];

    if (req.user.role === 'citizen') {
        sql = `
            SELECT r.*, p.name as patient_name, f1.name as from_facility_name,
                   f2.name as to_facility_name, d.name as doctor_name,
                   hw.name as health_worker_name
            FROM referrals r
            JOIN patients p ON r.patient_id = p.id
            JOIN facilities f1 ON r.from_facility_id = f1.id
            LEFT JOIN facilities f2 ON r.to_facility_id = f2.id
            LEFT JOIN doctors d ON r.doctor_id = d.id
            LEFT JOIN users hw ON r.health_worker_id = hw.id
            WHERE p.user_id = $1
            ORDER BY r.created_at DESC
        `;
        params = [req.user.id];
    } else if (req.user.role === 'health_worker') {
        sql = `
            SELECT r.*, p.name as patient_name, f1.name as from_facility_name,
                   f2.name as to_facility_name, d.name as doctor_name,
                   hw.name as health_worker_name
            FROM referrals r
            JOIN patients p ON r.patient_id = p.id
            JOIN facilities f1 ON r.from_facility_id = f1.id
            LEFT JOIN facilities f2 ON r.to_facility_id = f2.id
            LEFT JOIN doctors d ON r.doctor_id = d.id
            LEFT JOIN users hw ON r.health_worker_id = hw.id
            WHERE r.health_worker_id = $1 OR p.health_worker_id = $1
            ORDER BY r.created_at DESC
        `;
        params = [req.user.id];
    } else {
        sql = `
            SELECT r.*, p.name as patient_name, f1.name as from_facility_name,
                   f2.name as to_facility_name, d.name as doctor_name,
                   hw.name as health_worker_name, u.name as user_name
            FROM referrals r
            JOIN patients p ON r.patient_id = p.id
            JOIN facilities f1 ON r.from_facility_id = f1.id
            LEFT JOIN facilities f2 ON r.to_facility_id = f2.id
            LEFT JOIN doctors d ON r.doctor_id = d.id
            LEFT JOIN users hw ON r.health_worker_id = hw.id
            LEFT JOIN users u ON p.user_id = u.id
            ORDER BY r.created_at DESC
        `;
    }

    const result = await query(sql, params);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));

// @route GET /api/referrals/:id
// @desc Get referral by ID
// @access Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await query(`
        SELECT r.*, p.name as patient_name, p.age, p.gender,
               f1.name as from_facility_name, f1.type as from_facility_type,
               f2.name as to_facility_name, f2.type as to_facility_type,
               d.name as doctor_name, d.department as doctor_department,
               hw.name as health_worker_name, u.name as user_name
        FROM referrals r
        JOIN patients p ON r.patient_id = p.id
        JOIN facilities f1 ON r.from_facility_id = f1.id
        LEFT JOIN facilities f2 ON r.to_facility_id = f2.id
        LEFT JOIN doctors d ON r.doctor_id = d.id
        LEFT JOIN users hw ON r.health_worker_id = hw.id
        LEFT JOIN users u ON p.user_id = u.id
        WHERE r.id = $1
    `, [id]);

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('Referral not found');
    }

    res.json({
        success: true,
        data: result.rows[0]
    });
}));

// @route POST /api/referrals
// @desc Create a new referral
// @access Private (health_worker or admin)
router.post('/', protect, asyncHandler(async (req, res) => {
    const { patient_id, from_facility_id, to_facility_id, doctor_id, reason, symptoms, required_service, priority, notes } = req.body;

    if (!patient_id || !from_facility_id || !reason || !priority) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    if (!['normal', 'urgent', 'emergency'].includes(priority)) {
        res.status(400);
        throw new Error('Priority must be normal, urgent, or emergency');
    }

    // Check permissions
    if (req.user.role === 'health_worker') {
        const patientCheck = await query(
            'SELECT id FROM patients WHERE id = $1 AND health_worker_id = $2',
            [patient_id, req.user.id]
        );
        if (patientCheck.rows.length === 0) {
            res.status(403);
            throw new Error('You can only create referrals for your assigned patients');
        }
    }

    // Recommend a facility if not provided
    let recommendedFacilityId = to_facility_id;
    if (!recommendedFacilityId && required_service) {
        const facilityCheck = await query(`
            SELECT f.id, f.name, f.type
            FROM facilities f
            JOIN facility_services fs ON f.id = fs.facility_id
            WHERE fs.service_name ILIKE $1
            AND f.is_active = true
            AND f.emergency_available = $2
            ORDER BY f.name
            LIMIT 1
        `, [required_service, priority === 'emergency']);

        if (facilityCheck.rows.length > 0) {
            recommendedFacilityId = facilityCheck.rows[0].id;
        }
    }

    const referralId = generateReferralId();

    const result = await query(
        `INSERT INTO referrals (patient_id, from_facility_id, to_facility_id, health_worker_id, doctor_id,
                 reason, symptoms, required_service, priority, status, recommended_facility_id, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
            patient_id,
            from_facility_id,
            to_facility_id,
            req.user.role === 'health_worker' ? req.user.id : null,
            doctor_id,
            reason,
            symptoms,
            required_service,
            priority,
            'pending',
            recommendedFacilityId,
            notes
        ]
    );

    // Create notification for patient
    await query(
        `INSERT INTO notifications (user_id, title, message, type, related_id)
         SELECT p.user_id, 'New Referral Created', $1, 'referral', $2
         FROM patients p WHERE p.id = $3`,
        [referralId, result.rows[0].id, patient_id]
    );

    res.status(201).json({
        success: true,
        message: 'Referral created successfully',
        data: result.rows[0]
    });
}));

// @route PUT /api/referrals/:id/status
// @desc Update referral status
// @access Private
router.put('/:id/status', protect, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
        res.status(400);
        throw new Error('Status is required');
    }

    if (!['pending', 'accepted', 'completed', 'rejected'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    const updateData = {
        status,
        notes: notes || null,
        completed_date: status === 'completed' ? 'NOW()' : null
    };

    const result = await query(
        `UPDATE referrals
         SET status = $1, notes = $2, completed_date = ${status === 'completed' ? 'NOW()' : 'completed_date'},
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [status, notes, id]
    );

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('Referral not found');
    }

    // Notify patient
    await query(
        `INSERT INTO notifications (user_id, title, message, type, related_id)
         SELECT p.user_id, 'Referral ${status}', $1, 'referral', $2
         FROM patients p
         JOIN referrals r ON p.id = r.patient_id
         WHERE r.id = $3`,
        [
            status === 'accepted' ? 'Your referral has been accepted' :
            status === 'completed' ? 'Your referral is completed' :
            status === 'rejected' ? 'Your referral was rejected' : 'Referral status updated',
            result.rows[0].id, id
        ]
    );

    res.json({
        success: true,
        data: result.rows[0]
    });
}));

// @route GET /api/referrals/recommend
// @desc Get recommended facility for referral
// @access Private
router.get('/recommend', protect, asyncHandler(async (req, res) => {
    const { required_service, lat, lng, from_facility_id, priority } = req.query;

    let sql = `
        SELECT f.*, l.district, l.state,
               (SELECT COUNT(*) FROM doctors WHERE facility_id = f.id AND is_available = true) as available_doctors,
               (SELECT json_agg(service_name) FROM facility_services WHERE facility_id = f.id AND is_available = true) as services
        FROM facilities f
        LEFT JOIN locations l ON f.location_id = l.id
        WHERE f.is_active = true
    `;
    const params = [];
    let paramIndex = 1;

    if (required_service) {
        sql += ` AND EXISTS (
            SELECT 1 FROM facility_services fs
            WHERE fs.facility_id = f.id AND fs.service_name ILIKE $${paramIndex}
        )`;
        params.push(`%${required_service}%`);
        paramIndex++;
    }

    if (from_facility_id) {
        sql += ` AND f.id != $${paramIndex}`;
        params.push(from_facility_id);
        paramIndex++;
    }

    if (priority === 'emergency') {
        sql += ` AND f.emergency_available = true`;
    }

    sql += ` ORDER BY f.name`;

    const result = await query(sql, params);

    let facilities = result.rows;

    // Add distance if user location provided
    if (lat && lng) {
        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);
        facilities = facilities.map(f => ({
            ...f,
            distance: parseFloat((() => {
                const R = 6371;
                const dLat = (parseFloat(f.latitude) - userLat) * Math.PI / 180;
                const dLon = (parseFloat(f.longitude) - userLng) * Math.PI / 180;
                const a = Math.sin(dLat / 2) ** 2 +
                    Math.cos(userLat * Math.PI / 180) * Math.cos(parseFloat(f.latitude) * Math.PI / 180) *
                    Math.sin(dLon / 2) ** 2;
                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            })().toFixed(2))
        }));
        facilities.sort((a, b) => a.distance - b.distance);
    }

    res.json({
        success: true,
        count: facilities.length,
        data: facilities.length > 0 ? facilities[0] : null,
        allOptions: facilities
    });
}));

module.exports = router;