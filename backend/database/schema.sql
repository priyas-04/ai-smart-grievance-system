-- ResolveAI Database Schema
-- MySQL Database Schema for Smart Grievance System

CREATE DATABASE IF NOT EXISTS resolveai_db;
USE resolveai_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('citizen', 'officer', 'admin') NOT NULL DEFAULT 'citizen',
    department_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    contact_info TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('water', 'electricity', 'road_transport', 'sanitation', 'general') NOT NULL,
    priority ENUM('low', 'medium', 'high') NOT NULL,
    status ENUM('pending', 'in_progress', 'resolved') NOT NULL DEFAULT 'pending',
    department_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    remarks TEXT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_complaints_user_id ON complaints(user_id);
CREATE INDEX idx_complaints_department_id ON complaints(department_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_category ON complaints(category);

-- Seed Data for Departments
INSERT INTO departments (name, contact_info) VALUES
('Water Department', 'water@municipality.gov | 1800-WATER'),
('Electricity Department', 'electricity@municipality.gov | 1800-POWER'),
('Road & Transport Department', 'roads@municipality.gov | 1800-ROADS'),
('Sanitation Department', 'sanitation@municipality.gov | 1800-CLEAN'),
('General Administration', 'admin@municipality.gov | 1800-HELP');

-- Seed Admin User (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('System Administrator', 'admin@resolveai.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvOa', 'admin');
