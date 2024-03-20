CREATE DATABASE crm;

USE crm;

CREATE TABLE Companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE ProductType (
    productType_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
   

CREATE TABLE Products (
    Products_id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR (255) NOT NULL,
    price INT UNSIGNED NOT NULL,
    productType_id INT,
    company_id INT,
    FOREIGN KEY (productType_id) REFERENCES ProductType (productType_id),
    FOREIGN KEY (company_id) REFERENCES Companies(company_id)
);



