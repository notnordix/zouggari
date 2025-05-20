-- Create database
CREATE DATABASE IF NOT EXISTS zouggari_transport;
USE zouggari_transport;

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    class VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    price_range VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Create vehicle_cities junction table
CREATE TABLE IF NOT EXISTS vehicle_cities (
    vehicle_id VARCHAR(36) NOT NULL,
    city_id INT NOT NULL,
    PRIMARY KEY (vehicle_id, city_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- Create features table
CREATE TABLE IF NOT EXISTS features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    language VARCHAR(2) NOT NULL DEFAULT 'fr',
    UNIQUE KEY (name, language)
);

-- Create vehicle_features junction table
CREATE TABLE IF NOT EXISTS vehicle_features (
    vehicle_id VARCHAR(36) NOT NULL,
    feature_id INT NOT NULL,
    PRIMARY KEY (vehicle_id, feature_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id VARCHAR(36) NOT NULL,
    language VARCHAR(2) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    translated_value TEXT NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    UNIQUE KEY (vehicle_id, language, field_name)
);

-- Create viewcounts table for analytics
CREATE TABLE IF NOT EXISTS viewcounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_path VARCHAR(255) NOT NULL,
    view_count INT NOT NULL DEFAULT 0,
    last_viewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (page_path)
);

-- Create indexes for better performance
CREATE INDEX idx_vehicles_brand ON vehicles(brand);
CREATE INDEX idx_vehicles_type ON vehicles(type);
CREATE INDEX idx_vehicles_class ON vehicles(class);
CREATE INDEX idx_vehicles_price_range ON vehicles(price_range);
CREATE INDEX idx_vehicles_available ON vehicles(available);
CREATE INDEX idx_translations_language ON translations(language);