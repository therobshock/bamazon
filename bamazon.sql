DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT,
    product_name VARCHAR(200),
    department_name VARCHAR(200),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    product_sales DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Flizzelbutt", "Flizzels and Pizzels", 9.99, 7), ("Shanks-A-Lot", "Toys and Games", 12.98, 2),
("Gamulules", "Seasonal", 1.99, 100), ("Pepperoni Pizzels", "Flizzels and Pizzels", 29.78, 5), ("Double D Batteries", "Adult Novelties", 14.99, 1),
("Sammimum", "Snacks", 4.99, 20), ("Flobios", "Breakfast", 3.98, 24), ("Paranthesenthetics", "Health and Beauty", 29.99, 0),
("Beer", "Beer and Wine", 15.99, 10), ("Wine", "Beer and Wine", 9.99, 18) ;

SELECT * FROM products;

CREATE TABLE departments (
	department_id int AUTO_INCREMENT,
    department_name VARCHAR(200),
    overhead_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

SELECT * FROM departments;