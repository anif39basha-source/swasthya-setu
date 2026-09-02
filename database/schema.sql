-- SwasthyaSetu Database Schema
-- PostgreSQL

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('citizen', 'health_worker', 'admin')),
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- LOCATIONS
-- ============================================================
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_locations_district ON locations(district);

-- ============================================================
-- HEALTHCARE FACILITIES
-- ============================================================
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('PHC', 'CHC', 'DISTRICT_HOSPITAL')),
    address TEXT NOT NULL,
    location_id UUID REFERENCES locations(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100),
    opening_time TIME DEFAULT '08:00:00',
    closing_time TIME DEFAULT '20:00:00',
    emergency_available BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_facilities_location ON facilities(location_id);
CREATE INDEX idx_facilities_type ON facilities(type);

-- ============================================================
-- FACILITY SERVICES
-- ============================================================
CREATE TABLE facility_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_facility_services_facility ON facility_services(facility_id);

-- ============================================================
-- DOCTORS
-- ============================================================
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(200),
    phone VARCHAR(15),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_doctors_facility ON doctors(facility_id);

-- ============================================================
-- PATIENTS
-- ============================================================
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    health_worker_id UUID REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    phone VARCHAR(15),
    address TEXT,
    location_id UUID REFERENCES locations(id),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(15),
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_patients_health_worker ON patients(health_worker_id);
CREATE INDEX idx_patients_location ON patients(location_id);

-- ============================================================
-- MEDICINES
-- ============================================================
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    dosage_form VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medicines_name ON medicines(name);

-- ============================================================
-- MEDICINE INVENTORY
-- ============================================================
CREATE TABLE medicine_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES medicines(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER DEFAULT 20,
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'low_stock', 'out_of_stock')) DEFAULT 'available',
    last_updated TIMESTAMP DEFAULT NOW(),
    updated_by UUID REFERENCES users(id)
);

CREATE INDEX idx_medicine_inventory_facility ON medicine_inventory(facility_id);
CREATE INDEX idx_medicine_inventory_medicine ON medicine_inventory(medicine_id);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    health_worker_id UUID REFERENCES users(id),
    facility_id UUID NOT NULL REFERENCES facilities(id),
    doctor_id UUID REFERENCES doctors(id),
    department VARCHAR(100),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    appointment_id VARCHAR(20) UNIQUE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_facility ON appointments(facility_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================================
-- REFERRALS
-- ============================================================
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    from_facility_id UUID NOT NULL REFERENCES facilities(id),
    to_facility_id UUID REFERENCES facilities(id),
    health_worker_id UUID REFERENCES users(id),
    doctor_id UUID REFERENCES doctors(id),
    reason TEXT NOT NULL,
    symptoms TEXT,
    required_service VARCHAR(100),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('normal', 'urgent', 'emergency')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'completed', 'rejected')) DEFAULT 'pending',
    recommended_facility_id UUID REFERENCES facilities(id),
    referral_date TIMESTAMP DEFAULT NOW(),
    completed_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_referrals_patient ON referrals(patient_id);
CREATE INDEX idx_referrals_from_facility ON referrals(from_facility_id);
CREATE INDEX idx_referrals_to_facility ON referrals(to_facility_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_priority ON referrals(priority);

-- ============================================================
-- HEALTH RECORDS
-- ============================================================
CREATE TABLE health_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES users(id),
    facility_id UUID REFERENCES facilities(id),
    record_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    value VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_health_records_patient ON health_records(patient_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('appointment', 'referral', 'medicine', 'followup', 'emergency', 'announcement')),
    is_read BOOLEAN DEFAULT false,
    related_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================
-- OFFLINE PENDING ACTIONS
-- ============================================================
CREATE TABLE pending_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    synced_at TIMESTAMP
);

CREATE INDEX idx_pending_actions_user ON pending_actions(user_id);
CREATE INDEX idx_pending_actions_status ON pending_actions(status);
