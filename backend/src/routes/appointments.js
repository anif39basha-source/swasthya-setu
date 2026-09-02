// Appointments routes
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { protect, authorizeRole } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

// Generate appointment ID
function generateAppointmentId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);

    return `APPT-${year}${month}${day}-${random}`;
}

// ============================================================
// GET /api/appointments
// Get appointments based on user role
// ============================================================
router.get('/', protect, asyncHandler(async (req, res) => {
    let sql;
    let params = [];

    if (req.user.role === 'citizen') {
        sql = `
            SELECT 
                a.*,
                p.name AS patient_name,
                f.name AS facility_name,
                d.name AS doctor_name,
                f.type AS facility_type
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN facilities f ON a.facility_id = f.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE p.user_id = $1
               OR a.patient_id IN (
                    SELECT id
                    FROM patients
                    WHERE health_worker_id = $1
               )
            ORDER BY a.appointment_date DESC, a.appointment_time
        `;

        params = [req.user.id];

    } else if (req.user.role === 'health_worker') {

        sql = `
            SELECT 
                a.*,
                p.name AS patient_name,
                f.name AS facility_name,
                d.name AS doctor_name,
                f.type AS facility_type
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN facilities f ON a.facility_id = f.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE a.health_worker_id = $1
               OR p.health_worker_id = $1
            ORDER BY a.appointment_date DESC, a.appointment_time
        `;

        params = [req.user.id];

    } else {

        sql = `
            SELECT 
                a.*,
                p.name AS patient_name,
                f.name AS facility_name,
                d.name AS doctor_name,
                f.type AS facility_type
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN facilities f ON a.facility_id = f.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.appointment_date DESC, a.appointment_time
        `;
    }

    const result = await query(sql, params);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));


// ============================================================
// GET /api/appointments/citizen
// Get appointments for current citizen
// ============================================================
router.get(
    '/citizen',
    protect,
    authorizeRole('citizen'),
    asyncHandler(async (req, res) => {

        const result = await query(`
            SELECT 
                a.*,
                p.name AS patient_name,
                f.name AS facility_name,
                f.type AS facility_type,
                d.name AS doctor_name,
                d.department
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN facilities f ON a.facility_id = f.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE p.user_id = $1
            ORDER BY a.appointment_date DESC, a.appointment_time
        `, [req.user.id]);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    })
);


// ============================================================
// GET /api/appointments/upcoming
// Get upcoming appointments
// ============================================================
router.get('/upcoming', protect, asyncHandler(async (req, res) => {

    const today = new Date().toISOString().split('T')[0];

    let sql;
    let params;

    if (req.user.role === 'citizen') {

        sql = `
            SELECT 
                a.*,
                p.name AS patient_name,
                f.name AS facility_name,
                f.type AS facility_type,
                d.name AS doctor_name,
                d.department
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN facilities f ON a.facility_id = f.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE p.user_id = $1
              AND a.appointment_date >= $2
              AND a.status = 'confirmed'
            ORDER BY a.appointment_date, a.appointment_time
        `;

        params = [req.user.id, today];

    } else if (req.user.role === 'health_worker') {

        sql = `
            SELECT 
                a.*,
                p.name AS patient_name,
                f.name AS facility_name,
                f.type AS facility_type,
                d.name AS doctor_name,
                d.department
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN facilities f ON a.facility_id = f.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            WHERE (
                    a.health_worker_id = $1
                    OR p.health_worker_id = $1
                  )
              AND a.appointment_date >= $2
              AND a.status IN ('confirmed', 'pending')
            ORDER BY a.appointment_date, a.appointment_time
        `;

        params = [req.user.id, today];

    } else {

        sql = `
            SELECT 
                a.*,
                p.name AS patient_name,
                f.name AS facility_name,
                f.type AS facility_type,
                d.name AS doctor_name,
                d.department,
                u.name AS health_worker_name
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN facilities f ON a.facility_id = f.id
            LEFT JOIN doctors d ON a.doctor_id = d.id
            LEFT JOIN users u ON a.health_worker_id = u.id
            WHERE a.appointment_date >= $1
              AND a.status IN ('confirmed', 'pending')
            ORDER BY a.appointment_date, a.appointment_time
        `;

        params = [today];
    }

    const result = await query(sql, params);

    res.json({
        success: true,
        count: result.rows.length,
        data: result.rows
    });
}));


// ============================================================
// POST /api/appointments
// Book an appointment
// ============================================================
router.post('/', protect, asyncHandler(async (req, res) => {

    const {
        patient_id,
        facility_id,
        doctor_id,
        department,
        appointment_date,
        appointment_time,
        notes
    } = req.body;


    // --------------------------------------------------------
    // Validate required fields
    // --------------------------------------------------------
    if (
        !patient_id ||
        !facility_id ||
        !appointment_date ||
        !appointment_time
    ) {
        res.status(400);

        throw new Error(
            'Missing required fields: patient_id, facility_id, appointment_date, appointment_time'
        );
    }


    // --------------------------------------------------------
    // Check patient belongs to citizen
    // --------------------------------------------------------
    if (req.user.role === 'citizen') {

        const patientCheck = await query(
            `
            SELECT id
            FROM patients
            WHERE id = $1
              AND user_id = $2
            `,
            [patient_id, req.user.id]
        );

        if (patientCheck.rows.length === 0) {
            res.status(403);

            throw new Error(
                'You can only book appointments for your own record'
            );
        }
    }


    // --------------------------------------------------------
    // Check whether time slot is already booked
    // --------------------------------------------------------
    const slotCheck = await query(
        `
        SELECT id
        FROM appointments
        WHERE facility_id = $1
          AND appointment_date = $2
          AND appointment_time = $3
          AND status IN ($4, $5)
        `,
        [
            facility_id,
            appointment_date,
            appointment_time,
            'pending',
            'confirmed'
        ]
    );

    if (slotCheck.rows.length > 0) {
        res.status(409);

        throw new Error(
            'This time slot is already booked'
        );
    }


    // --------------------------------------------------------
    // Generate appointment ID
    // --------------------------------------------------------
    const appointmentId = generateAppointmentId();


    // --------------------------------------------------------
    // Create appointment
    // --------------------------------------------------------
    const result = await query(
        `
        INSERT INTO appointments (
            patient_id,
            health_worker_id,
            facility_id,
            doctor_id,
            department,
            appointment_date,
            appointment_time,
            appointment_id,
            notes,
            status
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            'pending'
        )
        RETURNING *
        `,
        [
            patient_id,
            req.user.role === 'health_worker'
                ? req.user.id
                : null,
            facility_id,
            doctor_id || null,
            department || null,
            appointment_date,
            appointment_time,
            appointmentId,
            notes || null
        ]
    );


    // --------------------------------------------------------
    // Create notification for assigned health worker
    //
    // IMPORTANT:
    // A patient may not have a health_worker_id.
    // Therefore we only insert a notification when one exists.
    // --------------------------------------------------------
    await query(
        `
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            related_id
        )
        SELECT
            p.health_worker_id,
            'New Appointment',
            $1,
            'appointment',
            $2
        FROM patients p
        WHERE p.id = $3
          AND p.health_worker_id IS NOT NULL
        `,
        [
            `New appointment ${appointmentId} has been booked.`,
            result.rows[0].id,
            patient_id
        ]
    );


    // --------------------------------------------------------
    // Send successful response
    // --------------------------------------------------------
    res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        data: result.rows[0]
    });
}));


// ============================================================
// GET /api/appointments/:id
// Get appointment by ID
// ============================================================
router.get('/:id', protect, asyncHandler(async (req, res) => {

    const { id } = req.params;

    const result = await query(
        `
        SELECT 
            a.*,
            p.name AS patient_name,
            p.age AS patient_age,
            p.gender,
            f.name AS facility_name,
            f.type AS facility_type,
            d.name AS doctor_name,
            d.department,
            d.qualification,
            u.name AS health_worker_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN facilities f ON a.facility_id = f.id
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN users u ON a.health_worker_id = u.id
        WHERE a.id = $1
        `,
        [id]
    );

    if (result.rows.length === 0) {
        res.status(404);

        throw new Error('Appointment not found');
    }

    res.json({
        success: true,
        data: result.rows[0]
    });
}));


// ============================================================
// PUT /api/appointments/:id/status
// Update appointment status
// ============================================================
router.put('/:id/status', protect, asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { status, notes } = req.body;


    if (!status) {
        res.status(400);
        throw new Error('Status is required');
    }


    if (
        ![
            'pending',
            'confirmed',
            'cancelled',
            'completed'
        ].includes(status)
    ) {
        res.status(400);
        throw new Error('Invalid status');
    }


    // --------------------------------------------------------
    // Update appointment
    // --------------------------------------------------------
    const result = await query(
        `
        UPDATE appointments
        SET
            status = $1,
            notes = $2,
            updated_at = NOW()
        WHERE id = $3
        RETURNING *
        `,
        [
            status,
            notes || null,
            id
        ]
    );


    if (result.rows.length === 0) {
        res.status(404);

        throw new Error('Appointment not found');
    }


    // --------------------------------------------------------
    // Notify citizen
    //
    // p.user_id should normally exist.
    // IS NOT NULL protects the notification insert.
    // --------------------------------------------------------
    await query(
        `
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            related_id
        )
        SELECT
            p.user_id,
            $1,
            $2,
            'appointment',
            $3
        FROM patients p
        JOIN appointments a
            ON p.id = a.patient_id
        WHERE a.id = $4
          AND p.user_id IS NOT NULL
        `,
        [
            `Appointment ${status}`,
            status === 'confirmed'
                ? 'Your appointment is confirmed.'
                : status === 'cancelled'
                    ? 'Your appointment was cancelled.'
                    : status === 'completed'
                        ? 'Your appointment has been completed.'
                        : 'Your appointment status has been updated.',
            result.rows[0].id,
            id
        ]
    );


    res.json({
        success: true,
        data: result.rows[0]
    });
}));


// ============================================================
// DELETE /api/appointments/:id
// Cancel appointment
// ============================================================
router.delete('/:id', protect, asyncHandler(async (req, res) => {

    const { id } = req.params;

    let sql;
    let params = [id];


    // --------------------------------------------------------
    // Citizen access
    // --------------------------------------------------------
    if (req.user.role === 'citizen') {

        sql = `
            SELECT a.id
            FROM appointments a
            JOIN patients p
                ON a.patient_id = p.id
            WHERE a.id = $1
              AND p.user_id = $2
        `;

        params = [
            id,
            req.user.id
        ];


    // --------------------------------------------------------
    // Health worker access
    // --------------------------------------------------------
    } else if (req.user.role === 'health_worker') {

        sql = `
            SELECT a.id
            FROM appointments a
            LEFT JOIN patients p
                ON a.patient_id = p.id
            WHERE a.id = $1
              AND (
                    a.health_worker_id = $2
                    OR p.health_worker_id = $2
                  )
        `;

        params = [
            id,
            req.user.id
        ];


    // --------------------------------------------------------
    // Admin access
    // --------------------------------------------------------
    } else {

        sql = `
            SELECT id
            FROM appointments
            WHERE id = $1
        `;
    }


    const checkResult = await query(
        sql,
        params
    );


    if (checkResult.rows.length === 0) {
        res.status(404);

        throw new Error(
            'Appointment not found or access denied'
        );
    }


    // --------------------------------------------------------
    // Cancel appointment
    // --------------------------------------------------------
    const result = await query(
        `
        UPDATE appointments
        SET
            status = 'cancelled',
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );


    res.json({
        success: true,
        message: 'Appointment cancelled',
        data: result.rows[0]
    });
}));


// ============================================================
// Export router
// ============================================================
module.exports = router;