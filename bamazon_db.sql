DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;


USE bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NULL,
    department_name VARCHAR(30) NULL,
    price DECIMAL(5,2),
    stock_quantity INTEGER (255) NULL,
    primary key (item_id)

);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("LED Light", "Electronics", 4.50, 4), ("iPhone", "Mobile Phones", 399.99, 150),("HDMI Cables", "Computer Accessories", 10.00, 150),
("Mouse", "Computer Accessories", 10.00, 50),("Flash Light", "Electronics", 2.00, 90),("MP3 Player", "Electronics", 41.50, 10),
("Guitar Picks", "Musical Instruments", 4.99, 150),("Piano", "Musical Instruments", 104.59, 30),("Electric Guitar", "Musical Instruments", 94.00, 150),
("Samsung Galaxy", "Mobile Phones", 178.99, 4);

SELECT * FROM products;
