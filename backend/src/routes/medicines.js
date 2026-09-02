// ============================================================
// Medicine Routes
// ============================================================

const express = require('express');
const router = express.Router();

const { query } = require('../config/database');

const {
    protect,
    authorizeRole
} = require('../middleware/auth');

const asyncHandler = require('express-async-handler');


// ============================================================
// GET /api/medicines
// Get all medicines
// Public
// ============================================================

router.get(
    '/',
    asyncHandler(async (req, res) => {

        const { search } = req.query;

        let sql = `
            SELECT
                id,
                name,
                description,
                dosage_form,
                created_at
            FROM medicines
        `;

        const params = [];

        if (search && search.trim()) {

            sql += `
                WHERE
                    name ILIKE $1
                    OR description ILIKE $1
            `;

            params.push(`%${search.trim()}%`);
        }

        sql += `
            ORDER BY name ASC
            LIMIT 100
        `;

        const result = await query(sql, params);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    })
);


// ============================================================
// GET /api/medicines/search
// Search medicine availability across facilities
// Public
// ============================================================

router.get(
    '/search',
    asyncHandler(async (req, res) => {

        const {
            name,
            lat,
            lng
        } = req.query;

        if (!name || !name.trim()) {

            res.status(400);

            throw new Error(
                'Medicine name is required'
            );
        }

        const result = await query(
            `
            SELECT
                m.id AS medicine_id,
                m.name AS medicine_name,
                m.description,
                m.dosage_form,

                f.id AS facility_id,
                f.name AS facility_name,
                f.type,
                f.address,
                f.phone,
                f.latitude,
                f.longitude,

                mi.id AS inventory_id,
                mi.quantity,
                mi.min_stock_level,
                mi.status,
                mi.last_updated

            FROM medicines m

            JOIN medicine_inventory mi
                ON m.id = mi.medicine_id

            JOIN facilities f
                ON mi.facility_id = f.id

            WHERE
                (
                    m.name ILIKE $1
                    OR m.description ILIKE $1
                )
                AND f.is_active = true

            ORDER BY
                CASE
                    WHEN mi.status = 'available'
                    THEN 1

                    WHEN mi.status = 'low_stock'
                    THEN 2

                    ELSE 3
                END,

                mi.quantity DESC,
                f.name ASC
            `,
            [`%${name.trim()}%`]
        );

        let inventory = result.rows;


        // ----------------------------------------------------
        // Calculate distance if location is supplied
        // ----------------------------------------------------

        if (
            lat !== undefined &&
            lng !== undefined &&
            !Number.isNaN(parseFloat(lat)) &&
            !Number.isNaN(parseFloat(lng))
        ) {

            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);

            inventory = inventory.map(item => {

                const facilityLat =
                    parseFloat(item.latitude);

                const facilityLng =
                    parseFloat(item.longitude);

                if (
                    Number.isNaN(facilityLat) ||
                    Number.isNaN(facilityLng)
                ) {

                    return {
                        ...item,
                        distance: null
                    };
                }

                const R = 6371;

                const dLat =
                    (facilityLat - userLat) *
                    Math.PI /
                    180;

                const dLon =
                    (facilityLng - userLng) *
                    Math.PI /
                    180;

                const a =
                    Math.sin(dLat / 2) ** 2 +
                    Math.cos(
                        userLat * Math.PI / 180
                    ) *
                    Math.cos(
                        facilityLat * Math.PI / 180
                    ) *
                    Math.sin(dLon / 2) ** 2;

                const distance =
                    R *
                    2 *
                    Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                    );

                return {
                    ...item,
                    distance:
                        parseFloat(
                            distance.toFixed(2)
                        )
                };
            });

            inventory.sort(
                (a, b) =>
                    (a.distance ?? Infinity) -
                    (b.distance ?? Infinity)
            );
        }


        res.json({
            success: true,
            count: inventory.length,
            data: inventory
        });
    })
);


// ============================================================
// GET /api/medicines/facility/:facilityId
// Get medicines available at one facility
// Public
// ============================================================

router.get(
    '/facility/:facilityId',
    asyncHandler(async (req, res) => {

        const {
            facilityId
        } = req.params;

        const {
            status
        } = req.query;

        let sql = `
            SELECT

                -- Medicine information
                m.id AS medicine_id,
                m.name,
                m.description,
                m.dosage_form,

                -- IMPORTANT:
                -- This is medicine_inventory.id
                mi.id AS inventory_id,

                mi.quantity,
                mi.min_stock_level,
                mi.status,
                mi.last_updated

            FROM medicines m

            JOIN medicine_inventory mi
                ON m.id = mi.medicine_id

            WHERE
                mi.facility_id = $1
        `;

        const params = [
            facilityId
        ];

        if (
            status &&
            [
                'available',
                'low_stock',
                'out_of_stock'
            ].includes(status)
        ) {

            sql += `
                AND mi.status = $2
            `;

            params.push(status);
        }

        sql += `
            ORDER BY m.name ASC
        `;

        const result =
            await query(sql, params);

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    })
);


// ============================================================
// GET /api/medicines/admin/inventory
// Get complete medicine inventory for Admin
// Private/Admin
// ============================================================

router.get(
    '/admin/inventory',
    protect,
    authorizeRole('admin'),
    asyncHandler(async (req, res) => {

        const {
            search,
            status,
            facility_id
        } = req.query;

        let sql = `
            SELECT

                -- Inventory ID
                mi.id AS inventory_id,

                -- Inventory information
                mi.quantity,
                mi.min_stock_level,
                mi.status,
                mi.last_updated,

                -- Medicine information
                m.id AS medicine_id,
                m.name AS medicine_name,
                m.description,
                m.dosage_form,

                -- Facility information
                f.id AS facility_id,
                f.name AS facility_name,
                f.type AS facility_type,
                f.address AS facility_address

            FROM medicine_inventory mi

            JOIN medicines m
                ON mi.medicine_id = m.id

            JOIN facilities f
                ON mi.facility_id = f.id

            WHERE
                f.is_active = true
        `;

        const params = [];
        let paramIndex = 1;


        // ----------------------------------------------------
        // Search
        // ----------------------------------------------------

        if (
            search &&
            search.trim()
        ) {

            sql += `
                AND (
                    m.name ILIKE $${paramIndex}
                    OR f.name ILIKE $${paramIndex}
                )
            `;

            params.push(
                `%${search.trim()}%`
            );

            paramIndex++;
        }


        // ----------------------------------------------------
        // Status filter
        // ----------------------------------------------------

        if (
            status &&
            [
                'available',
                'low_stock',
                'out_of_stock'
            ].includes(status)
        ) {

            sql += `
                AND mi.status = $${paramIndex}
            `;

            params.push(status);

            paramIndex++;
        }


        // ----------------------------------------------------
        // Facility filter
        // ----------------------------------------------------

        if (facility_id) {

            sql += `
                AND mi.facility_id = $${paramIndex}
            `;

            params.push(facility_id);

            paramIndex++;
        }


        sql += `
            ORDER BY

                CASE
                    WHEN mi.status = 'out_of_stock'
                    THEN 1

                    WHEN mi.status = 'low_stock'
                    THEN 2

                    ELSE 3
                END,

                f.name ASC,
                m.name ASC
        `;


        const result =
            await query(sql, params);


        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    })
);


// ============================================================
// GET /api/medicines/admin/summary
// Medicine inventory summary for Admin
// Private/Admin
// ============================================================

router.get(
    '/admin/summary',
    protect,
    authorizeRole('admin'),
    asyncHandler(async (req, res) => {

        const result = await query(`
            SELECT

                COUNT(*) AS total_inventory_records,

                COUNT(*) FILTER (
                    WHERE status = 'available'
                ) AS available,

                COUNT(*) FILTER (
                    WHERE status = 'low_stock'
                ) AS low_stock,

                COUNT(*) FILTER (
                    WHERE status = 'out_of_stock'
                ) AS out_of_stock,

                COALESCE(
                    SUM(quantity),
                    0
                ) AS total_units

            FROM medicine_inventory mi

            JOIN facilities f
                ON mi.facility_id = f.id

            WHERE
                f.is_active = true
        `);


        res.json({
            success: true,

            data: {

                totalInventoryRecords:
                    parseInt(
                        result.rows[0]
                            .total_inventory_records
                    ),

                available:
                    parseInt(
                        result.rows[0]
                            .available
                    ),

                lowStock:
                    parseInt(
                        result.rows[0]
                            .low_stock
                    ),

                outOfStock:
                    parseInt(
                        result.rows[0]
                            .out_of_stock
                    ),

                totalUnits:
                    parseInt(
                        result.rows[0]
                            .total_units
                    )
            }
        });
    })
);


// ============================================================
// GET /api/medicines/alerts/low-stock
// Get low-stock and out-of-stock medicines
// Private
// ============================================================

router.get(
    '/alerts/low-stock',
    protect,
    asyncHandler(async (req, res) => {

        const result = await query(`
            SELECT

                mi.id AS inventory_id,

                f.id AS facility_id,
                f.name AS facility_name,
                f.type AS facility_type,

                m.id AS medicine_id,
                m.name AS medicine_name,

                mi.quantity,
                mi.min_stock_level,
                mi.status,
                mi.last_updated

            FROM medicine_inventory mi

            JOIN facilities f
                ON mi.facility_id = f.id

            JOIN medicines m
                ON mi.medicine_id = m.id

            WHERE

                mi.status IN (
                    'low_stock',
                    'out_of_stock'
                )

                AND f.is_active = true

            ORDER BY

                CASE
                    WHEN mi.status = 'out_of_stock'
                    THEN 1

                    WHEN mi.status = 'low_stock'
                    THEN 2

                    ELSE 3
                END,

                mi.quantity ASC,
                f.name ASC,
                m.name ASC
        `);


        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    })
);


// ============================================================
// POST /api/medicines
// Create a new medicine
// Private/Admin
// ============================================================

router.post(
    '/',
    protect,
    authorizeRole('admin'),
    asyncHandler(async (req, res) => {

        const {
            name,
            description,
            dosage_form
        } = req.body;


        if (
            !name ||
            !name.trim()
        ) {

            res.status(400);

            throw new Error(
                'Medicine name is required'
            );
        }


        const result = await query(
            `
            INSERT INTO medicines
                (
                    name,
                    description,
                    dosage_form
                )

            VALUES
                ($1, $2, $3)

            RETURNING
                id,
                name,
                description,
                dosage_form,
                created_at
            `,
            [
                name.trim(),
                description || null,
                dosage_form || null
            ]
        );


        res.status(201).json({
            success: true,
            message:
                'Medicine created successfully',
            data: result.rows[0]
        });
    })
);


// ============================================================
// POST /api/medicines/inventory
// Add or update medicine inventory
// Private/Admin/Health Worker
// ============================================================

router.post(
    '/inventory',
    protect,
    authorizeRole(
        'admin',
        'health_worker'
    ),
    asyncHandler(async (req, res) => {

        const {
            facility_id,
            medicine_id,
            quantity,
            min_stock_level
        } = req.body;


        if (
            !facility_id ||
            !medicine_id ||
            quantity === undefined
        ) {

            res.status(400);

            throw new Error(
                'Facility, medicine and quantity are required'
            );
        }


        const numericQuantity =
            Number(quantity);

        if (
            Number.isNaN(numericQuantity) ||
            numericQuantity < 0
        ) {

            res.status(400);

            throw new Error(
                'Quantity must be a valid non-negative number'
            );
        }


        const numericMinStock =
            min_stock_level !== undefined
                ? Number(min_stock_level)
                : 20;


        if (
            Number.isNaN(numericMinStock) ||
            numericMinStock < 0
        ) {

            res.status(400);

            throw new Error(
                'Minimum stock level must be a valid non-negative number'
            );
        }


        // ----------------------------------------------------
        // Automatically calculate stock status
        // ----------------------------------------------------

        let status = 'available';

        if (
            numericQuantity === 0
        ) {

            status = 'out_of_stock';

        } else if (
            numericQuantity <
            numericMinStock
        ) {

            status = 'low_stock';
        }


        const result = await query(
            `
            INSERT INTO medicine_inventory
                (
                    facility_id,
                    medicine_id,
                    quantity,
                    min_stock_level,
                    status,
                    updated_by
                )

            VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )

            ON CONFLICT
                (
                    facility_id,
                    medicine_id
                )

            DO UPDATE SET

                quantity =
                    EXCLUDED.quantity,

                min_stock_level =
                    EXCLUDED.min_stock_level,

                status =
                    EXCLUDED.status,

                last_updated =
                    NOW(),

                updated_by =
                    EXCLUDED.updated_by

            RETURNING *
            `,
            [
                facility_id,
                medicine_id,
                numericQuantity,
                numericMinStock,
                status,
                req.user.id
            ]
        );


        res.status(201).json({
            success: true,
            message:
                'Medicine inventory updated successfully',
            data: result.rows[0]
        });
    })
);


// ============================================================
// PUT /api/medicines/inventory/:id
// Update medicine inventory
// Private/Admin/Health Worker
// ============================================================

router.put(
    '/inventory/:id',
    protect,
    authorizeRole(
        'admin',
        'health_worker'
    ),
    asyncHandler(async (req, res) => {

        const {
            id
        } = req.params;

        const {
            quantity,
            min_stock_level
        } = req.body;


        // ----------------------------------------------------
        // Get current inventory
        // ----------------------------------------------------

        const current =
            await query(
                `
                SELECT *
                FROM medicine_inventory
                WHERE id = $1
                `,
                [id]
            );


        if (
            current.rows.length === 0
        ) {

            res.status(404);

            throw new Error(
                'Inventory record not found'
            );
        }


        const currentRecord =
            current.rows[0];


        const newQuantity =
            quantity !== undefined
                ? Number(quantity)
                : Number(
                    currentRecord.quantity
                );


        const newMinStock =
            min_stock_level !== undefined
                ? Number(min_stock_level)
                : Number(
                    currentRecord.min_stock_level
                );


        if (
            Number.isNaN(newQuantity) ||
            newQuantity < 0
        ) {

            res.status(400);

            throw new Error(
                'Quantity must be a valid non-negative number'
            );
        }


        if (
            Number.isNaN(newMinStock) ||
            newMinStock < 0
        ) {

            res.status(400);

            throw new Error(
                'Minimum stock level must be a valid non-negative number'
            );
        }


        // ----------------------------------------------------
        // Calculate status
        // ----------------------------------------------------

        let status = 'available';

        if (
            newQuantity === 0
        ) {

            status = 'out_of_stock';

        } else if (
            newQuantity <
            newMinStock
        ) {

            status = 'low_stock';
        }


        const result =
            await query(
                `
                UPDATE medicine_inventory

                SET

                    quantity = $1,

                    min_stock_level = $2,

                    status = $3,

                    last_updated = NOW(),

                    updated_by = $4

                WHERE id = $5

                RETURNING *
                `,
                [
                    newQuantity,
                    newMinStock,
                    status,
                    req.user.id,
                    id
                ]
            );


        res.json({
            success: true,
            message:
                'Medicine inventory updated successfully',
            data: result.rows[0]
        });
    })
);


// ============================================================
// DELETE /api/medicines/inventory/:id
// Remove inventory record
// Private/Admin
// ============================================================

router.delete(
    '/inventory/:id',
    protect,
    authorizeRole('admin'),
    asyncHandler(async (req, res) => {

        const {
            id
        } = req.params;


        const result =
            await query(
                `
                DELETE FROM medicine_inventory

                WHERE id = $1

                RETURNING id
                `,
                [id]
            );


        if (
            result.rows.length === 0
        ) {

            res.status(404);

            throw new Error(
                'Inventory record not found'
            );
        }


        res.json({
            success: true,
            message:
                'Inventory record deleted successfully'
        });
    })
);


// ============================================================
// DELETE /api/medicines/:id
// Delete medicine
// Private/Admin
// ============================================================

router.delete(
    '/:id',
    protect,
    authorizeRole('admin'),
    asyncHandler(async (req, res) => {

        const {
            id
        } = req.params;


        // ----------------------------------------------------
        // Check whether medicine exists
        // ----------------------------------------------------

        const medicine =
            await query(
                `
                SELECT id
                FROM medicines
                WHERE id = $1
                `,
                [id]
            );


        if (
            medicine.rows.length === 0
        ) {

            res.status(404);

            throw new Error(
                'Medicine not found'
            );
        }


        // ----------------------------------------------------
        // Check whether medicine is being used
        // ----------------------------------------------------

        const inventory =
            await query(
                `
                SELECT id
                FROM medicine_inventory
                WHERE medicine_id = $1
                LIMIT 1
                `,
                [id]
            );


        if (
            inventory.rows.length > 0
        ) {

            res.status(400);

            throw new Error(
                'Cannot delete medicine because it has inventory records. Update the inventory instead.'
            );
        }


        // ----------------------------------------------------
        // Delete medicine
        // ----------------------------------------------------

        const result =
            await query(
                `
                DELETE FROM medicines

                WHERE id = $1

                RETURNING id
                `,
                [id]
            );


        if (
            result.rows.length === 0
        ) {

            res.status(404);

            throw new Error(
                'Medicine not found'
            );
        }


        res.json({
            success: true,
            message:
                'Medicine deleted successfully'
        });
    })
);


// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;