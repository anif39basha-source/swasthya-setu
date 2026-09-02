// Admin routes
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, authorizeRole } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// @route GET /api/admin/dashboard
// @desc Get admin dashboard statistics
// @access Private/Admin
router.get('/dashboard', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const [
        facilitiesResult,
        doctorsResult,
        patientsResult,
        appointmentsResult,
        referralsResult,
        medicinesResult,
        healthWorkersResult,
        pendingReferralsResult,
        todayAppointmentsResult
    ] = await Promise.all([
        query('SELECT COUNT(*) as total FROM facilities WHERE is_active = true'),
        query('SELECT COUNT(*) as total FROM doctors WHERE is_available = true'),
        query('SELECT COUNT(*) as total FROM patients'),
        query('SELECT COUNT(*) as total FROM appointments'),
        query('SELECT COUNT(*) as total FROM referrals'),
        query('SELECT COUNT(*) as total FROM medicine_inventory WHERE status = $1', ['available']),
        query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['health_worker']),
        query('SELECT COUNT(*) as total FROM referrals WHERE status = $1', ['pending']),
        query('SELECT COUNT(*) as total FROM appointments WHERE appointment_date = CURRENT_DATE')
    ]);

    res.json({
        success: true,
        data: {
            totalFacilities: parseInt(facilitiesResult.rows[0].total),
            totalDoctors: parseInt(doctorsResult.rows[0].total),
            totalPatients: parseInt(patientsResult.rows[0].total),
            totalAppointments: parseInt(appointmentsResult.rows[0].total),
            totalReferrals: parseInt(referralsResult.rows[0].total),
            availableMedicines: parseInt(medicinesResult.rows[0].total),
            totalHealthWorkers: parseInt(healthWorkersResult.rows[0].total),
            pendingReferrals: parseInt(pendingReferralsResult.rows[0].total),
            todayAppointments: parseInt(todayAppointmentsResult.rows[0].total)
        }
    });
}));

// @route GET /api/admin/analytics
// @desc Get analytics for charts
// @access Private/Admin
router.get('/analytics', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    // Patients by district
    const patientsByDistrict = await query(`
        SELECT l.district, COUNT(p.id) as count
        FROM patients p
        JOIN locations l ON p.location_id = l.id
        GROUP BY l.district
        ORDER BY count DESC
    `);

    // Appointments per day (last 7 days)
 const appointmentsPerDay = await query(`
    SELECT
        TO_CHAR(d.date, 'YYYY-MM-DD') AS date,
        COUNT(a.id) AS count
    FROM generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
    ) AS d(date)
    LEFT JOIN appointments a
        ON a.appointment_date = d.date
    GROUP BY d.date
    ORDER BY d.date
`);

    // Facility utilization
    const facilityUtilization = await query(`
        SELECT f.type, COUNT(a.id) as count
        FROM appointments a
        JOIN facilities f ON a.facility_id = f.id
        WHERE a.appointment_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY f.type
    `);

    // Medicine stock status
    const medicineStock = await query(`
        SELECT status, COUNT(*) as count
        FROM medicine_inventory
        GROUP BY status
    `);

    // Referrals by priority
    const referralsByPriority = await query(`
        SELECT priority, COUNT(*) as count
        FROM referrals
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY priority
    `);

    res.json({
        success: true,
        data: {
            patientsByDistrict: patientsByDistrict.rows,
            appointmentsPerDay: appointmentsPerDay.rows,
            facilityUtilization: facilityUtilization.rows,
            medicineStock: medicineStock.rows,
            referralsByPriority: referralsByPriority.rows
        }
    });
}));

// @route GET /api/admin/users
// @desc Get all users
// @access Private/Admin
router.get('/users', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const { role } = req.query;

    let sql = 'SELECT id, name, phone, email, role, language, created_at FROM users';
    const params = [];

    if (role) {
        sql += ' WHERE role = $1';
        params.push(role);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));

// @route DELETE /api/admin/users/:id
// @desc Deactivate user
// @access Private/Admin
router.delete('/users/:id', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (id === req.user.id) {
        res.status(400);
        throw new Error('You cannot deactivate your own account');
    }

    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json({
        success: true,
        message: 'User deleted successfully'
    });
}));

// @route GET /api/admin/medicines/low-stock
// @desc Get low stock medicines across all facilities
// @access Private/Admin
router.get('/medicines/low-stock', protect, authorizeRole('admin'), asyncHandler(async (req, res) => {
    const result = await query(`
        SELECT f.name as facility_name, m.name as medicine_name,
               mi.quantity, mi.min_stock_level, mi.status
        FROM medicine_inventory mi
        JOIN facilities f ON mi.facility_id = f.id
        JOIN medicines m ON mi.medicine_id = m.id
        WHERE mi.status IN ('low_stock', 'out_of_stock')
        AND f.is_active = true
        ORDER BY mi.status, mi.quantity
    `);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));

module.exports = router;