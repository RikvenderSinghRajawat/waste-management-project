
CREATE DATABASE waste_management;
USE waste_management;

/* Users table */
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    profile_pic VARCHAR(255),
    is_admin BOOLEAN DEFAULT FALSE
);

/* Complaints table */
CREATE TABLE Complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    complaint TEXT,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

/* Waste Collection table */
CREATE TABLE WasteCollection (
    collection_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    location VARCHAR(255),
    waste_type VARCHAR(255),
    weight_kg FLOAT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

/* Waste Trends table */
CREATE TABLE WasteTrends (
    trend_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255),
    waste_type VARCHAR(255),
    total_weight FLOAT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
