require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'swasthya_setu',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
    ssl: false
});

async function seedDemoData() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('Adding SwasthyaSetu demo healthcare data...');

        // --------------------------------------------------
        // LOCATIONS
        // --------------------------------------------------

        const locations = [];

        const locationData = [
            ['Bengaluru Urban', 'Bengaluru', 'Karnataka', 12.9716, 77.5946],
            ['Yelahanka', 'Bengaluru', 'Karnataka', 13.1007, 77.5963],
            ['Electronic City', 'Bengaluru', 'Karnataka', 12.8452, 77.6602],
            ['Whitefield', 'Bengaluru', 'Karnataka', 12.9698, 77.7500]
        ];

        for (const item of locationData) {
            const result = await client.query(
                `INSERT INTO locations
                (name, district, state, latitude, longitude)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id`,
                item
            );

            locations.push(result.rows[0].id);
        }

        // --------------------------------------------------
        // FACILITIES
        // --------------------------------------------------

        const facilities = [];

        const facilityData = [
            [
                'Jayanagar Primary Health Centre',
                'PHC',
                'Jayanagar, Bengaluru, Karnataka',
                locations[0],
                12.9250,
                77.5937,
                '080-26761234',
                true
            ],
            [
                'Yelahanka Community Health Centre',
                'CHC',
                'Yelahanka, Bengaluru, Karnataka',
                locations[1],
                13.1007,
                77.5963,
                '080-28561234',
                true
            ],
            [
                'Electronic City Primary Health Centre',
                'PHC',
                'Electronic City, Bengaluru, Karnataka',
                locations[2],
                12.8452,
                77.6602,
                '080-27831234',
                true
            ],
            [
                'Whitefield District Hospital',
                'DISTRICT_HOSPITAL',
                'Whitefield, Bengaluru, Karnataka',
                locations[3],
                12.9698,
                77.7500,
                '080-28451234',
                true
            ]
        ];

        for (const item of facilityData) {
            const result = await client.query(
                `INSERT INTO facilities
                (name, type, address, location_id, latitude, longitude, phone, emergency_available, is_active)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)
                RETURNING id`,
                item
            );

            facilities.push(result.rows[0].id);
        }

        // --------------------------------------------------
        // SERVICES
        // --------------------------------------------------

        const services = [
            ['General Medicine', 'Laboratory Testing', 'Maternal & Child Health'],
            ['General Medicine', 'Emergency Care', 'Vaccination'],
            ['General Medicine', 'Pharmacy', 'Immunization'],
            ['General Medicine', 'Emergency Care', 'Laboratory Testing']
        ];

        for (let i = 0; i < facilities.length; i++) {
            for (const service of services[i]) {
                await client.query(
                    `INSERT INTO facility_services
                    (facility_id, service_name, is_available)
                    VALUES ($1, $2, true)`,
                    [facilities[i], service]
                );
            }
        }

        // --------------------------------------------------
        // DOCTORS
        // --------------------------------------------------

        const doctors = [
            ['Priya Sharma', facilities[0], 'General Medicine', 'MBBS'],
            ['Rahul Kumar', facilities[0], 'Pediatrics', 'MBBS, MD'],
            ['Anita Rao', facilities[1], 'General Medicine', 'MBBS, MD'],
            ['Vikram Singh', facilities[1], 'Orthopedics', 'MBBS, MS'],
            ['Meena Devi', facilities[2], 'General Medicine', 'MBBS'],
            ['Arjun Nair', facilities[3], 'Cardiology', 'MBBS, MD'],
            ['Kavya Menon', facilities[3], 'Gynecology', 'MBBS, MD']
        ];

        for (const doctor of doctors) {
            await client.query(
                `INSERT INTO doctors
                (name, facility_id, department, qualification, is_available)
                VALUES ($1,$2,$3,$4,true)`,
                doctor
            );
        }

        // --------------------------------------------------
        // MEDICINES
        // --------------------------------------------------

        const medicineData = [
            ['Paracetamol', 'Used for fever and mild pain', 'Tablet'],
            ['ORS', 'Oral rehydration solution', 'Sachet'],
            ['Azithromycin', 'Antibiotic medicine', 'Tablet'],
            ['Ceftriaxone', 'Antibiotic medicine', 'Injection'],
            ['Insulin', 'Medicine used to control blood glucose', 'Injection'],
            ['Metformin', 'Medicine commonly used for diabetes', 'Tablet'],
            ['Amoxicillin', 'Antibiotic medicine', 'Capsule'],
            ['Ibuprofen', 'Used for pain and inflammation', 'Tablet']
        ];

        const medicines = [];

        for (const medicine of medicineData) {
            const result = await client.query(
                `INSERT INTO medicines
                (name, description, dosage_form)
                VALUES ($1,$2,$3)
                RETURNING id`,
                medicine
            );

            medicines.push(result.rows[0].id);
        }

        // --------------------------------------------------
        // MEDICINE INVENTORY
        // --------------------------------------------------

        const quantities = [
            [100, 15, 0, 50, 80, 35, 70, 45],
            [60, 25, 10, 40, 50, 20, 30, 20],
            [120, 5, 20, 0, 40, 10, 60, 35],
            [200, 80, 50, 25, 90, 70, 100, 60]
        ];

        for (let f = 0; f < facilities.length; f++) {
            for (let m = 0; m < medicines.length; m++) {

                const quantity = quantities[f][m];

                let status = 'available';

                if (quantity === 0) {
                    status = 'out_of_stock';
                } else if (quantity < 20) {
                    status = 'low_stock';
                }

                await client.query(
                    `INSERT INTO medicine_inventory
                    (facility_id, medicine_id, quantity, min_stock_level, status)
                    VALUES ($1,$2,$3,20,$4)`,
                    [
                        facilities[f],
                        medicines[m],
                        quantity,
                        status
                    ]
                );
            }
        }

        // --------------------------------------------------
        // CREATE PATIENT PROFILE FOR CURRENT CITIZENS
        // --------------------------------------------------

        await client.query(`
            INSERT INTO patients
            (user_id, name, age, gender, phone, address)
            SELECT
                u.id,
                u.name,
                20,
                'male',
                u.phone,
                'Bengaluru, Karnataka'
            FROM users u
            WHERE u.role = 'citizen'
            AND NOT EXISTS (
                SELECT 1
                FROM patients p
                WHERE p.user_id = u.id
            )
        `);

        await client.query('COMMIT');

        console.log('');
        console.log('========================================');
        console.log('✅ DEMO DATA ADDED SUCCESSFULLY');
        console.log('========================================');
        console.log(`Healthcare facilities: ${facilities.length}`);
        console.log(`Doctors: ${doctors.length}`);
        console.log(`Medicines: ${medicines.length}`);
        console.log('Medicine inventory: Added');
        console.log('Patient profiles: Added for citizens');
        console.log('========================================');

    } catch (error) {
        await client.query('ROLLBACK');

        console.error('❌ Demo data failed:');
        console.error(error.message);

    } finally {
        client.release();
        await pool.end();
    }
}

seedDemoData();