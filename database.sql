CREATE TABLE User (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE,
    IsEnable TINYINT DEFAULT 1,
    Name VARCHAR(100),
    Birth DATE,
    Gender VARCHAR(15),
    InitDate DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE Brand (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Status TINYINT DEFAULT 1,
    Priority INTEGER DEFAULT 0 NOT NULL,
    Phone VARCHAR(15),
    Google VARCHAR(255),
    Location VARCHAR(255),
    Facebook VARCHAR(255),
    Image VARCHAR(255),
    Slug VARCHAR(255) UNIQUE,
    TypeID INTEGER NOT NULL,
    InitDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TypeID) REFERENCES BrandType(ID)
);
CREATE TABLE BrandType(
	ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);
CREATE TABLE Employee ( 
ID INT AUTO_INCREMENT PRIMARY KEY, 
PositionID INT NOT NULL, 
Username VARCHAR(50) NOT NULL, 
Password VARCHAR(255) NOT NULL, 
Phone VARCHAR(15) UNIQUE, 
Email VARCHAR(100) UNIQUE, 
IsEnable TINYINT DEFAULT 1, 
Name VARCHAR(100), 
Birth DATE, 
Gender VARCHAR(15), 
InitDate DATETIME DEFAULT CURRENT_TIMESTAMP, 
FOREIGN KEY (PositionID) REFERENCES HangOut_thrownbelt.Position(ID) 
);
DROP TABLE Employee;

CREATE TABLE Position (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Level INT,
    Name VARCHAR(100) NOT NULL
);
DROP TABLE Employee;
SELECT * From Brand;
INSERT INTO Position (Name, Level) VALUES 
('Admin', 1), 
('Manager', 2), 
('Employee', 3);
INSERT INTO Employee (PositionID, Username, Password, Phone, Email, IsEnable, Name, Birth, Gender) VALUES 
(3, 'employee1', '123456', '123-456-7890', 'john.doe@example.com', 1, 'John Doe', '1990-05-15', 'Male'),
(3, 'employee2', '123456', '123-555-7890', 'jane.smith@example.com', 1, 'Jane Smith', '1992-08-20', 'Female'),
(2, 'employee3', '123456', '123-444-7890', 'michael@example.com', 1, 'Tuan Kiet', '1992-06-23', 'Male');
INSERT INTO User(Username, Password, Phone, Email, Name, Birth, Gender) VALUES
("PhatHai", "123", "0907123", "tuankiet@gmail.com", "Phát Hải", "2004-06-10", "Nam");
INSERT INTO BrandType(Name) VALUES
("Ăn uống"),
("Giải trí"),
("Du lịch"),
("Mua sắm");

INSERT INTO Brand(Name, Priority, Phone, Google, Location, Facebook, Image, Slug, TypeID) VALUES
("Fruit Crush", 0, "0907243699", "google.com", "479 Lê Trọng Tấn, P. Tây Thạnh, Quận Tân Phú, TPHCM", "facebook.com", "brands/brand1.jpeg", "fruit-crush", 1),
("Bánh Bao Thọ Phát", 0, "0907243699", "google.com", "232 Nguyễn Hữu Thọ, P. Tây Thạnh, Quận Tân Phú, TPHCM", "facebook.com", "brands/brand2.jpeg", "banh-bao-tho-phat", 1),
("Cơm Tấm Phúc Lộc Thọ - 656 Quang Trung", 0, "0907243699", "google.com", "479 Lê Trọng Tấn, P. Tây Thạnh, Quận Tân Phú, TPHCM", "facebook.com", "brands/brand3.jpeg", "phuc-loc-tho-656-quang-trung", 1),
("Steak Zone", 0, "0907243699", "google.com", "479 Lê Trọng Tấn, P. Tây Thạnh, Quận Tân Phú, TPHCM", "facebook.com", "brands/brand4.jpeg", "steak-zone", 2),
("Hanuri 13 Cộng Hòa", 0, "0907243699", "google.com", "479 Lê Trọng Tấn, P. Tây Thạnh, Quận Tân Phú, TPHCM", "facebook.com", "brands/brand5.jpeg", "hanuri-13-cong-hoa", 2),
("Rau Má Mix Đồng Đen", 0, "0907243699", "google.com", "479 Lê Trọng Tấn, P. Tây Thạnh, Quận Tân Phú, TPHCM", "facebook.com", "brands/brand6.jpeg", "rau-ma-mix-dong-den", 1);
INSERT INTO role (Level, Name) VALUES 
(1, 'Admin'), 
(2, 'Manager'), 
(3, 'Employee');
INSERT INTO Employee (Position, Username, Password, Phone, Email, IsEnable, Name, Birth, Gender, InitDate) VALUES 
(3, 'employee1', 'password123', '123-456-7890', 'john.doe@example.com', 1, 'John Doe', '1990-05-15', 'Male', CURRENT_TIMESTAMP),
(3, 'employee2', 'password123', '123-555-7890', 'jane.smith@example.com', 1, 'Jane Smith', '1992-08-20', 'Female', CURRENT_TIMESTAMP);

SELECT * From Brand;
SELECT * From User;
SHOW TABLES;
