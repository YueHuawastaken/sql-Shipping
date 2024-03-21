CREATE DATABASE crm;

USE crm;

CREATE TABLE Companies (
    companyId INT UNSIGNED PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL
);

CREATE TABLE ProductType (
    productTypeId INT UNSIGNED PRIMARY KEY,
    typeName VARCHAR(255) NOT NULL
);
   

CREATE TABLE Products (
    ProductsId INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR (255) NOT NULL,
    price INT UNSIGNED NOT NULL,
    productTypeId INT UNSIGNED,
    companyId INT UNSIGNED,
    FOREIGN KEY (productTypeId) REFERENCES ProductType (productTypeId),
    FOREIGN KEY (companyId) REFERENCES Companies(companyId)
);



