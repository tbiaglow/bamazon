DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(30) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL(10, 2),
stock_quantity INTEGER(11),
product_sales DECIMAL(10, 2),
PRIMARY KEY (item_id)
);

CREATE TABLE departments (
department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
department_name VARCHAR(30) NOT NULL,
over_head_costs INTEGER(11),
PRIMARY KEY (department_id)
);

