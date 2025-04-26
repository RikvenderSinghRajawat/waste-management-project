
CREATE DATABASE waste_management;
USE waste_management;
drop database waste_management ;
show databases ;
CREATE DATABASE IF NOT EXISTS waste_management;
truncate table complaints ;
USE waste_management;
drop table Complaints  ;
CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    profile_pic VARCHAR(255) DEFAULT '/static/profile_pics/default_user.jpeg',
    is_admin BOOLEAN DEFAULT 0
);


CREATE TABLE IF NOT EXISTS Complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    complaint TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WasteCollection (
    waste_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    location VARCHAR(255),
    waste_type VARCHAR(100),
    weight_kg FLOAT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WasteTrends (
    trend_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255),
    waste_type VARCHAR(100),
    total_weight FLOAT DEFAULT 0
);

ALTER TABLE Users ADD COLUMN profile_pic VARCHAR(255) DEFAULT '/static/profile_pics/default_user.jpg';
ALTER TABLE users MODIFY password VARCHAR(555);
ALTER TABLE users MODIFY email VARCHAR(555);
ALTER TABLE users MODIFY password VARCHAR(555);
select * from users;

SELECT user_id, name, email, password FROM Users WHERE email = 'rikvendrarajput@gmail.com';

DESCRIBE Users;
INSERT INTO Users (name, email, password, profile_pic, is_admin)
VALUES 
('Rishi', 'rajput1@gmail.com', 
 SHA2('12345', 256),  -- This hashes the password using SHA-256
 '/static/profile_pics/admin_default.jpeg', 
 1); 
 INSERT INTO Users (name, email, password, profile_pic, is_admin)
VALUES 
('Rishi', 'rajput2@gmail.com', 
 '12345',  -- This hashes the password using SHA-256
 '/static/profile_pics/admin_default.jpeg', 
 1); 
 select * from users ;
 
 DELETE FROM Users
WHERE email = 'Vishakha@gmail.com';
