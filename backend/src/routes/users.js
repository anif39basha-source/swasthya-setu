// Users routes
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, authorizeRole } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// @route GET /api/users/health-workers
// @desc Get all health workers
// @access Public
router.get('/health-workers', asyncHandler(async (req, res) => {
    const result = await query(
        'SELECT id, name, phone, email, role, created_at FROM users WHERE role = $1',
        ['health_worker']
    );

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));

// @route GET /api/users/patients
// @desc Get all patients
// @access Public
router.get('/patients', protect, authorizeRole('admin', 'health_worker'), asyncHandler(async (req, res) => {
    let sql = `
        SELECT p.id, p.name, p.age, p.gender, p.phone, p.address,
               l.name as location_name, l.district,
               u.name as health_worker_name, p.created_at
        FROM patients p
        LEFT JOIN locations l ON p.location_id = l.id
        LEFT JOIN users u ON p.health_worker_id = u.id
    `;
    const params = [];

    if (req.user.role === 'health_worker') {
        sql += ' WHERE p.health_worker_id = $1';
        params.push(req.user.id);
    }

    sql += ' ORDER BY p.name';

    const result = await query(sql, params);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));



// @route GET /api/users/me/patient
// @desc Get or create the patient profile for the logged-in citizen
// @access Private/Citizen
router.get('/me/patient', protect, authorizeRole('citizen'), asyncHandler(async (req, res) => {
    let result = await query(
        `SELECT id, user_id, name, age, gender, phone, address
         FROM patients WHERE user_id = $1 LIMIT 1`,
        [req.user.id]
    );

    if (result.rows.length === 0) {
        result = await query(
            `INSERT INTO patients (user_id, name, age, gender, phone)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, user_id, name, age, gender, phone, address`,
            [req.user.id, req.user.name, 18, 'other', req.user.phone]
        );
    }

    res.json({ success: true, data: result.rows[0] });
}));

// @route GET /api/users/stats
// @desc Get platform statistics
// @access Public
router.get('/stats', asyncHandler(async (req, res) => {
    const [facilitiesCount, doctorsCount, patientsCount, appointmentsCount, referralsCount, notificationsCount] = await Promise.all([
        query('SELECT COUNT(*) FROM facilities WHERE is_active = true'),
        query('SELECT COUNT(*) FROM doctors WHERE is_available = true'),
        query('SELECT COUNT(*) FROM patients'),
        query('SELECT COUNT(*) FROM appointments'),
        query('SELECT COUNT(*) FROM referrals'),
        query('SELECT COUNT(*) FROM notifications WHERE is_read = false')
    ]);

    res.json({
        success: true,
        data: {
            totalFacilities: parseInt(facilitiesCount.rows[0].count),
            totalDoctors: parseInt(doctorsCount.rows[0].count),
            totalPatients: parseInt(patientsCount.rows[0].count),
            totalAppointments: parseInt(appointmentsCount.rows[0].count),
            totalReferrals: parseInt(referralsCount.rows[0].count),
            unreadNotifications: parseInt(notificationsCount.rows[0].count),
            // Demo data for charts
            patientsByDistrict: [
                { district: 'Kottayam', count: 45 },
                { district: 'Kannur', count: 32 },
                { district: 'Puducherry', count: 28 },
                { district: 'Coimbatore', count: 24 },
                { district: 'Kurnool', count: 21 }
            ],
            appointmentsPerDay: [
                { date: '2024-01-01', count: 15 },
                { date: '2024-01-02', count: 18 },
                { date: '2024-01-03', count: 22 },
                { date: '2024-01-04', count: 16 },
                { date: '2024-01-05', count: 20 },
                { date: '2024-01-06', count: 25 },
                { date: '2024-01-07', count: 19 }
            ],
            facilityUtilization: [
                { type: 'PHC', count: 4 },
                { type: 'CHC', count: 3 },
                { type: 'DISTRICT_HOSPITAL', count: 1 }
            ],
            medicineStockStatus: [
                { status: 'available', count: 85 },
                { status: 'low_stock', count: 32 },
                { status: 'out_of_stock', count: 8 }
            ]
        }
    });
}));

module.exports = router;