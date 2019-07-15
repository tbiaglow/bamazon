DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL(10, 2),
stock_quantity INTEGER(11),
PRIMARY KEY (item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, 'Mop', 'Cleaning', 23.99, 12);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (2, 'Vacuum', 'Cleaning', 52.99, 8);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (3, 'Lemon Detergent', 'Cleaning', 8.45, 20);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (4, 'Charcoal', 'Outdoor/Garden', 19.95, 7);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (5, 'Lightbulb', 'Electrical', 12.40, 10);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (6, 'Weedwacker', 'Outdoor/Garden', 85.43, 4);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (7, 'Buzzsaw', 'Hardware', 64.27, 4);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (8, 'Toilet Lid', 'Bath', 32.95, 6);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (9, 'Light Switch', 'Electrical', 15.48, 12);
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (10, 'Screwdriver', 'Hardware', 8.99, 20);
