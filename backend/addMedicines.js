require('dotenv').config();

const { query } = require('./src/config/database');

const medicines = [
    ['Paracetamol', 'Used for fever and mild pain', 'Tablet'],
    ['ORS', 'Oral rehydration solution for dehydration', 'Sachet'],
    ['Amoxicillin', 'Antibiotic medicine', 'Capsule'],
    ['Azithromycin', 'Antibiotic medicine', 'Tablet'],
    ['Ibuprofen', 'Used for pain and inflammation', 'Tablet'],
    ['Metformin', 'Medicine commonly used for diabetes', 'Tablet'],
    ['Insulin', 'Medicine used to control blood glucose', 'Injection'],
    ['Cetirizine', 'Used for allergy symptoms', 'Tablet']
];

async function addMedicines() {
    try {
        for (const medicine of medicines) {
            await query(
                `INSERT INTO medicines
                (name, description, dosage_form)
                VALUES ($1, $2, $3)`,
                medicine
            );

            console.log(`Added: ${medicine[0]}`);
        }

        console.log('');
        console.log('✅ All medicines added successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit();
    }
}

addMedicines();