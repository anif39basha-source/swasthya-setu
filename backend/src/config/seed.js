// Seed database with demo data
const { query } = require('./database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Hash passwords
        const bcryptSalt = await bcrypt.genSalt(12);
        const citizenPassword = await bcrypt.hash('citizen123', bcryptSalt);
        const healthWorkerPassword = await bcrypt.hash('healthworker123', bcryptSalt);
       const adminPassword = await bcrypt.hash('Apoorva123456', bcryptSalt);

        // Insert users
        console.log('👤 Inserting users...');
        const users = await query(
            `INSERT INTO users (name, phone, email, password_hash, role, language) VALUES
            ($1, $2, $3, $4, $5, $6),
            ($7, $8, $9, $10, $11, $12),
            ($13, $14, $15, $16, $17, $18)
            RETURNING id`,
            [
                'Ravi Kumar', '9876543210', 'ravi.kumar@example.com', citizenPassword, 'citizen', 'en',
                'Anita Sharma', '8877665544', 'anita.sharma@example.com', healthWorkerPassword, 'health_worker', 'en',
               'Apoorva', '9966554433', 'apoorva@example.com', adminPassword, 'admin', 'en'
            ]
        );

        const userIds = users.rows.map(row => row.id);

        // Insert locations
        console.log('📍 Inserting locations...');
        const locations = await query(
            `INSERT INTO locations (name, district, state, latitude, longitude) VALUES
            ($1, $2, $3, $4, $5),
            ($6, $7, $8, $9, $10),
            ($11, $12, $13, $14, $15),
            ($16, $17, $18, $19, $20),
            ($21, $22, $23, $24, $25)
            RETURNING id`,
            [
                'Kottayam Village', 'Kottayam', 'Kerala', 9.5937, 76.5452,
                'Kannur Town', 'Kannur', 'Kerala', 11.8667, 75.3704,
                'Puducherry', 'Puducherry', 'Puducherry', 11.9416, 79.8083,
                'Coimbatore Rural', 'Coimbatore', 'Tamil Nadu', 11.0168, 76.9558,
                'Kurnool District', 'Kurnool', 'Andhra Pradesh', 15.8197, 78.0708
            ]
        );

        const locationIds = locations.rows.map(row => row.id);

        // Insert facilities
        console.log('🏥 Inserting facilities...');
        const facilities = await query(
            `INSERT INTO facilities (name, type, address, location_id, latitude, longitude, phone, opening_time, closing_time, emergency_available) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
            ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20),
            ($21, $22, $23, $24, $25, $26, $27, $28, $29, $30),
            ($31, $32, $33, $34, $35, $36, $37, $38, $39, $40),
            ($41, $42, $43, $44, $45, $46, $47, $48, $49, $50)
            RETURNING id`,
            [
                'Govt. PHC Kottayam', 'PHC', 'Kottayam Village Center', locationIds[0], 9.5937, 76.5452, '9876501234', '08:00:00', '20:00:00', true,
                'Govt. CHC Kannur', 'CHC', 'Kannur Town Hospital', locationIds[1], 11.8667, 75.3704, '9876501235', '08:00:00', '20:00:00', true,
                'District Hospital Puducherry', 'DISTRICT_HOSPITAL', 'Puducherry Main Hospital', locationIds[2], 11.9416, 79.8083, '9876501236', '08:00:00', '21:00:00', true,
                'Govt. PHC Coimbatore', 'PHC', 'Coimbatore Rural Health Center', locationIds[3], 11.0168, 76.9558, '9876501237', '08:00:00', '20:00:00', false,
                'Govt. CHC Kurnool', 'CHC', 'Kurnool District Hospital', locationIds[4], 15.8197, 78.0708, '9876501238', '08:00:00', '20:00:00', true
            ]
        );

        const facilityIds = facilities.rows.map(row => row.id);

        // Insert medicines
        console.log('💊 Inserting medicines...');
        const medicines = await query(
            `INSERT INTO medicines (name, description, dosage_form) VALUES
            ($1, $2, $3),
            ($4, $5, $6),
            ($7, $8, $9),
            ($10, $11, $12),
            ($13, $14, $15)
            RETURNING id`,
            [
                'Paracetamol', 'Fever and pain relief', 'Tablet',
                'ORS', 'Oral rehydration solution', 'Oral Solution',
                'Azithromycin', 'Antibiotic', 'Capsule',
                'Ceftriaxone', 'Strong antibiotic', 'Injection',
                'Insulin', 'Diabetes medication', 'Injection'
            ]
        );

        const medicineIds = medicines.rows.map(row => row.id);

        // Insert facility services
        console.log('🔧 Inserting facility services...');
        const services = await query(
            `INSERT INTO facility_services (facility_id, service_name, is_available) VALUES
            ${Array(20).fill('(DEFAULT, $1, $2)').join(', ')}
            RETURNING id`,
            [
                facilityIds[0], 'General consultation', true,
                facilityIds[0], 'Maternal care', true,
                facilityIds[0], 'Child care', true,
                facilityIds[0], 'Emergency', true,
                facilityIds[0], 'Laboratory', true,
                facilityIds[0], 'Pharmacy', true,
                facilityIds[1], 'General consultation', true,
                facilityIds[1], 'Maternal care', true,
                facilityIds[1], 'Child care', true,
                facilityIds[1], 'Emergency', true,
                facilityIds[1], 'Laboratory', true,
                facilityIds[1], 'Pharmacy', true,
                facilityIds[2], 'General consultation', true,
                facilityIds[2], 'Maternal care', true,
                facilityIds[2], 'Child care', true,
                facilityIds[2], 'Emergency', true,
                facilityIds[2], 'Laboratory', true,
                facilityIds[2], 'Pharmacy', true,
                facilityIds[3], 'General consultation', true,
                facilityIds[3], 'Maternal care', true,
                facilityIds[3], 'Child care', true,
                facilityIds[4], 'General consultation', true,
                facilityIds[4], 'Maternal care', true,
                facilityIds[4], 'Child care', true,
                facilityIds[4], 'Emergency', true,
                facilityIds[4], 'Laboratory', true,
                facilityIds[4], 'Pharmacy', true
            ]
        );

        // Insert doctors
        console.log('👨‍⚕️ Inserting doctors...');
        const doctors = await query(
            `INSERT INTO doctors (name, facility_id, department, qualification, phone, is_available) VALUES
            ($1, $2, $3, $4, $5, $6),
            ($7, $8, $9, $10, $11, $12),
            ($13, $14, $15, $16, $17, $18),
            ($19, $20, $21, $22, $23, $24),
            ($25, $26, $27, $28, $29, $30),
            ($31, $32, $33, $34, $35, $36)
            RETURNING id`,
            [
                'Dr. Mohan Iyer', facilityIds[0], 'General Medicine', 'MBBS, MD', '9876501111', true,
                'Dr. Lakshmi Nair', facilityIds[0], 'Gynecology', 'MBBS, DGO', '9876501112', true,
                'Dr. Rajesh Kumar', facilityIds[0], 'Pediatrics', 'MBBS, MD', '9876501113', true,
                'Dr. Suresh Reddy', facilityIds[1], 'General Medicine', 'MBBS, MD', '9876501114', true,
                'Dr. Meena Das', facilityIds[1], 'Gynecology', 'MBBS, DGO', '9876501115', true,
                'Dr. Arun Pillai', facilityIds[2], 'General Surgery', 'MS, MBBS', '9876501116', true,
                'Dr. Kavitha Rao', facilityIds[3], 'General Medicine', 'MBBS, MD', '9876501117', true,
                'Dr. Karthik', facilityIds[4], 'General Medicine', 'MBBS', '9876501118', true,
                'Dr. Anita Devi', facilityIds[4], 'Gynecology', 'MBBS, DGO', '9876501119', true,
                'Dr. Prakash', facilityIds[4], 'Pediatrics', 'MBBS, MD', '9876501120', true
            ]
        );

        const doctorIds = doctors.rows.map(row => row.id);

        // Insert patients
        console.log('👥 Inserting patients...');
        const patients = await query(
            `INSERT INTO patients (user_id, health_worker_id, name, age, gender, phone, address, location_id, emergency_contact_name, emergency_contact_phone) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
            ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20),
            ($21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
            RETURNING id`,
            [
                userIds[0], userIds[1], 'Ram Singh', 45, 'male', '9988776655', 'Kottayam Village', locationIds[0], 'Sita Devi', '9988776644',
                userIds[0], userIds[1], 'Gita Sharma', 32, 'female', '9977665544', 'Kannur Town', locationIds[1], 'Bihar Dev', '9977665533',
                userIds[0], userIds[1], 'Krishna Pillai', 28, 'male', '9966554422', 'Coimbatore Rural', locationIds[3], 'Lakshmi', '9966554411'
            ]
        );

        const patientIds = patients.rows.map(row => row.id);

        // Insert medicine inventory
        console.log('💊 Inserting medicine inventory...');
        const inventory = await query(
            `INSERT INTO medicine_inventory (facility_id, medicine_id, quantity, min_stock_level, status, updated_by) VALUES
            ${Array(15).fill('(DEFAULT, $1, $2, $3, $4, $5)').join(', ')}
            RETURNING id`,
            [
                facilityIds[0], medicineIds[0], 850, 100, 'available', userIds[2],
                facilityIds[0], medicineIds[1], 42, 30, 'low_stock', userIds[2],
                facilityIds[0], medicineIds[2], 120, 50, 'available', userIds[2],
                facilityIds[0], medicineIds[3], 45, 30, 'low_stock', userIds[2],
                facilityIds[0], medicineIds[4], 30, 20, 'available', userIds[2],
                facilityIds[1], medicineIds[0], 120, 100, 'available', userIds[2],
                facilityIds[1], medicineIds[1], 80, 30, 'available', userIds[2],
                facilityIds[1], medicineIds[2], 60, 50, 'available', userIds[2],
                facilityIds[1], medicineIds[3], 90, 30, 'available', userIds[2],
                facilityIds[1], medicineIds[4], 25, 20, 'low_stock', userIds[2],
                facilityIds[2], medicineIds[0], 200, 100, 'available', userIds[2],
                facilityIds[2], medicineIds[1], 150, 30, 'available', userIds[2],
                facilityIds[2], medicineIds[2], 80, 50, 'available', userIds[2],
                facilityIds[2], medicineIds[3], 35, 30, 'available', userIds[2],
                facilityIds[2], medicineIds[4], 15, 20, 'low_stock', userIds[2]
            ]
        );

        // Insert appointments
        console.log('📅 Inserting appointments...');
        const appointments = await query(
            `INSERT INTO appointments (patient_id, health_worker_id, facility_id, doctor_id, department, appointment_date, appointment_time, status, appointment_id, notes) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
            ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING id`,
            [
                patientIds[0], userIds[1], facilityIds[0], doctorIds[0], 'General Medicine', '2024-01-15', '10:00:00', 'confirmed', 'APPT-001', 'Follow up needed',
                patientIds[1], userIds[1], facilityIds[1], doctorIds[3], 'General Medicine', '2024-01-16', '14:30:00', 'pending', 'APPT-002', 'First visit'
            ]
        );

        // Insert referrals
        console.log('🔗 Inserting referrals...');
        const referrals = await query(
            `INSERT INTO referrals (patient_id, from_facility_id, to_facility_id, health_worker_id, doctor_id, reason, symptoms, required_service, priority, status, notes) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11),
            ($12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
            RETURNING id`,
            [
                patientIds[0], facilityIds[0], facilityIds[1], userIds[1], doctorIds[0], 'Special consultation', 'Chest pain for 3 days', 'Cardiology', 'urgent', 'pending', 'Need cardiology specialist',
                patientIds[1], facilityIds[1], facilityIds[2], userIds[1], doctorIds[5], 'Surgery consultation', 'Abdomen pain', 'Surgery', 'normal', 'accepted', 'Preparations needed'
            ]
        );

        console.log('✅ Database seeding completed successfully!');
        console.log(`- Created ${users.rows.length} users`);
        console.log(`- Created ${locations.rows.length} locations`);
        console.log(`- Created ${facilities.rows.length} facilities`);
        console.log(`- Created ${medicines.rows.length} medicines`);
        console.log(`- Created ${patients.rows.length} patients`);
        console.log(`- Created ${appointments.rows.length} appointments`);
        console.log(`- Created ${referrals.rows.length} referrals`);

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        throw error;
    }
}

module.exports = seedDatabase;

// Run seeding when this file is executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            process.exit(0);
        })
        .catch(() => {
            process.exit(1);
        });
}