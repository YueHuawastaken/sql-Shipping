
USE crm;
-- console.log("code is fine till here")
-- Inserting data into Companies
INSERT INTO Companies (companyId, companyName) VALUES
(1, 'FEDEX Express'),
(2, 'FEDEX'),
(3, 'DHL'),
(4, 'UPS'),
(5, 'ZIM Integrated Shipping');

INSERT INTO ProductType (productTypeId, typeName) VALUES
(1, 'Sensitive Goods'),
(2, 'Normal Goods');

INSERT INTO Products (name, price, productTypeId, companyId) VALUES
('Naruto Resin Statues', 500, 1, 3),
('Sasuke Resin Statues', 600, 2, 5),
('Sakura Resin Statues', 400, 1, 4);