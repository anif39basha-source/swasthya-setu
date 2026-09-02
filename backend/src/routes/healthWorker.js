// Health Worker routes
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, authorizeRole } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// @route GET /api/health-worker/dashboard
// @desc Get health worker dashboard stats
// @access Private/Health Worker
router.get('/dashboard', protect, authorizeRole('health_worker'), asyncHandler(async (req, res) => {
    const healthWorkerId = req.user.id;

    // Get assigned patients count
    const patientsResult = await query(
        'SELECT COUNT(DISTINCT p.id) as total_patients FROM patients p WHERE p.health_worker_id = $1 OR EXISTS (SELECT 1 FROM health_records hr WHERE hr.recorded_by = $1)',
        [healthWorkerId]
    );

    // Get appointments for assigned patients
    const appointmentsResult = await query(`
        SELECT COUNT(*) as total_appointments
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        WHERE (a.health_worker_id = $1 OR p.health_worker_id = $1)
        AND a.appointment_date = CURRENT_DATE
    `, [healthWorkerId]);

    // Get pending referrals
    const referralsResult = await query(`
        SELECT COUNT(*) as pending_referrals
        FROM referrals r
        JOIN patients p ON r.patient_id = p.id
        WHERE (r.health_worker_id = $1 OR p.health_worker_id = $1)
        AND r.status = 'pending'
    `, [healthWorkerId]);

    // Get recent health records
    const healthRecordsResult = await query(`
        SELECT hr.id, p.name as patient_name, hr.record_type, hr.created_at, f.name as facility_name
        FROM health_records hr
        JOIN patients p ON hr.patient_id = p.id
        LEFT JOIN facilities f ON hr.facility_id = f.id
        WHERE hr.recorded_by = $1
        ORDER BY hr.created_at DESC
        LIMIT 10
    `, [healthWorkerId]);

    res.json({
        success: true,
        data: {
            total_patients: parseInt(patientsResult.rows[0].total_patients),
            total_appointments: parseInt(appointmentsResult.rows[0].total_appointments),
            pending_referrals: parseInt(referralsResult.rows[0].pending_referrals),
            recent_health_records: healthRecordsResult.rows
        }
    });
}));

// @route GET /api/health-worker/patients
// @desc Get all patients assigned to health worker
// @access Private/Health Worker
router.get('/patients', protect, authorizeRole('health_worker'), asyncHandler(async (req, res) => {
    const healthWorkerId = req.user.id;

    const result = await query(`
        SELECT p.id, p.name, p.age, p.gender, p.phone, p.address,
               l.name as location_name, l.district,
               p.emergency_contact_name, p.emergency_contact_phone,
               p.created_at,
               (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id AND a.status = 'pending') as pending_appointments,
               (SELECT COUNT(*) FROM referrals r WHERE r.patient_id = p.id AND r.status = 'pending') as pending_referrals
        FROM patients p
        LEFT JOIN locations l ON p.location_id = l.id
        WHERE p.health_worker_id = $1
        ORDER BY p.name
    `, [healthWorkerId]);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));

// @route POST /api/health-worker/patients
// @desc Register a new patient
// @access Private/Health Worker
router.post('/patients', protect, authorizeRole('health_worker'), asyncHandler(async (req, res) => {
    const { name, age, gender, phone, address, location_id, emergency_contact_name, emergency_contact_phone, medical_history } = req.body;

    if (!name || !age || !gender || !phone) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    const result = await query(
        `INSERT INTO patients (health_worker_id, name, age, gender, phone, address, location_id, emergency_contact_name, emergency_contact_phone, medical_history)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [req.user.id, name, age, gender, phone, address, location_id, emergency_contact_name, emergency_contact_phone, medical_history]
    );

    res.status(201).json({
        success: true,
        message: 'Patient registered successfully',
        data: result.rows[0]
    });
}));

// @route PUT /api/health-worker/patients/:id
// @desc Update patient information
// @access Private/Health Worker
router.put('/patients/:id', protect, authorizeRole('health_worker'), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, phone, address, location_id, emergency_contact_name, emergency_contact_phone, medical_history } = req.body;

    const patientCheck = await query(
        'SELECT id FROM patients WHERE id = $1 AND health_worker_id = $2',
        [id, req.user.id]
    );

    if (patientCheck.rows.length === 0) {
        res.status(403);
        throw new Error('Access denied: Patient not assigned to you');
    }

    const result = await query(
        `UPDATE patients
         SET name = COALESCE($1, name),
             age = COALESCE($2, age),
             gender = COALESCE($3, gender),
             phone = COALESCE($4, phone),
             address = COALESCE($5, address),
             location_id = COALESCE($6, location_id),
             emergency_contact_name = COALESCE($7, emergency_contact_name),
             emergency_contact_phone = COALESCE($8, emergency_contact_phone),
             medical_history = COALESCE($9, medical_history),
             updated_at = NOW()
         WHERE id = $10
         RETURNING *`,
        [name, age, gender, phone, address, location_id, emergency_contact_name, emergency_contact_phone, medical_history, id]
    );

    res.json({
        success: true,
        message: 'Patient information updated',
        data: result.rows[0]
    });
}));

// @route POST /api/health-worker/health-records
// @desc Add health record for patient
// @access Private/Health Worker
router.post('/health-records', protect, authorizeRole('health_worker'), asyncHandler(async (req, res) => {
    const { patient_id, facility_id, record_type, description, value, notes } = req.body;

    if (!patient_id || !record_type || !description) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    const patientCheck = await query(
        'SELECT id FROM patients WHERE id = $1 AND health_worker_id = $2',
        [patient_id, req.user.id]
    );

    if (patientCheck.rows.length === 0) {
        res.status(403);
        throw new Error('Access denied: Patient not assigned to you');
    }

    const result = await query(
        `INSERT INTO health_records (patient_id, recorded_by, facility_id, record_type, description, value, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [patient_id, req.user.id, facility_id, record_type, description, value, notes]
    );

    res.status(201).json({
        success: true,
        message: 'Health record added successfully',
        data: result.rows[0]
    });
}));

// @route GET /api/health-worker/appointments
// @desc Get appointments for health worker's patients
// @access Private/Health Worker
router.get('/appointments', protect, authorizeRole('health_worker'), asyncHandler(async (req, res) => {
    const healthWorkerId = req.user.id;

    const result = await query(`
        SELECT a.id, a.appointment_id, a.appointment_date, a.appointment_time, a.status, a.notes,
               p.name as patient_name, p.age, p.gender,
               f.name as facility_name, f.type as facility_type,
               d.name as doctor_name, d.department,
               (SELECT COUNT(*) FROM health_records hr WHERE hr.recorded_by = $1 AND p.id = hr.patient_id) as visit_count
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN facilities f ON a.facility_id = f.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        WHERE (a.health_worker_id = $1 OR p.health_worker_id = $1)
        ORDER BY a.appointment_date, a.appointment_time
    `, [healthWorkerId]);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));

// @route PUT /api/health-worker/appointments/:id
// @desc Update appointment for health worker
// @access Private/Health Worker
router.put('/appointments/:id', protect, authorizeRole('health_worker'), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, notes, doctor_id, department } = req.body;

    const appointmentCheck = await query(
        `SELECT a.id FROM appointments a
         JOIN patients p ON a.patient_id = p.id
         WHERE a.id = $1 AND (a.health_worker_id = $2 OR p.health_worker_id = $2)`,
        [id, req.user.id]
    );

    if (appointmentCheck.rows.length === 0) {
        res.status(403);
        throw new Error('Access denied: Appointment not assigned to you');
    }

    const result = await query(
        `UPDATE appointments
         SET status = COALESCE($1, status), notes = COALESCE($2, notes),
             doctor_id = COALESCE($3, doctor_id), department = COALESCE($4, department),
             updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [status, notes, doctor_id, department, id]
    );

    await query(
        `INSERT INTO notifications (user_id, title, message, type, related_id)
         SELECT p.user_id, 'Appointment Update', $1, 'appointment', $2
         FROM patients p
         JOIN appointments a ON p.id = a.patient_id
         WHERE a.id = $3`,
        [status === 'confirmed' ? 'Your appointment is confirmed' : status, result.rows[0].id, id]
    );

    res.json({
        success: true,
        message: 'Appointment updated',
        data: result.rows[0]
    });
}));

module.exports = router;