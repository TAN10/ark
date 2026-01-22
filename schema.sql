-- CRMS Master Database Schema
-- Optimized for Vercel Postgres (Neon)

-- 1. Users & Operators
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('ADMIN', 'OPERATOR', 'OWNER')) DEFAULT 'OPERATOR',
    status VARCHAR(10) CHECK (status IN ('ACTIVE', 'INACTIVE')) DEFAULT 'ACTIVE',
    password_hash TEXT, -- To be used with server-side auth
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vehicles (Fleet Assets)
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reg_no VARCHAR(20) UNIQUE NOT NULL,
    registration_date DATE,
    chasis_number VARCHAR(50) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    purchase_date DATE,
    insurance_company VARCHAR(100),
    insurance_start_date DATE,
    insurance_end_date DATE,
    puc_expiry_date DATE,
    fasttag_details VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'IDLE', 'MAINTENANCE')) DEFAULT 'IDLE',
    odometer_reading INTEGER DEFAULT 0,
    last_odometer_update DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Drivers (Personnel)
CREATE TABLE IF NOT EXISTS drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    dob DATE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    aadhar_number VARCHAR(12) UNIQUE NOT NULL,
    pan_number VARCHAR(10) UNIQUE NOT NULL,
    address TEXT,
    village VARCHAR(50),
    city VARCHAR(50),
    state VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('ONBOARDING', 'ACTIVE', 'INACTIVE')) DEFAULT 'ONBOARDING',
    onboarded_at DATE DEFAULT CURRENT_DATE,
    assigned_vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    payment_model VARCHAR(20) CHECK (payment_model IN ('DAILY', 'COMMISSION')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Maintenance Records
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    service_type VARCHAR(50) CHECK (service_type IN ('Engine Repair', 'Exterior Maintenance', 'Tire Change')),
    expense NUMERIC(12, 2) NOT NULL DEFAULT 0,
    service_date DATE NOT NULL,
    odometer_reading INTEGER NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Settlements (Financial Ledger)
CREATE TABLE IF NOT EXISTS settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    week_ending DATE NOT NULL,
    gross_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0,
    commission_deducted NUMERIC(12, 2) NOT NULL DEFAULT 0,
    fasttag_charges NUMERIC(12, 2) NOT NULL DEFAULT 0,
    rto_fines NUMERIC(12, 2) NOT NULL DEFAULT 0,
    toll_charges NUMERIC(12, 2) NOT NULL DEFAULT 0,
    other_charges NUMERIC(12, 2) NOT NULL DEFAULT 0,
    net_payable NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(10) CHECK (status IN ('PENDING', 'SETTLED')) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_vehicle_status ON vehicles(status);
CREATE INDEX idx_driver_status ON drivers(status);
CREATE INDEX idx_settlement_date ON settlements(week_ending);
CREATE INDEX idx_maintenance_vehicle ON maintenance_records(vehicle_id);