DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT,
    product_name VARCHAR(200),
    department_name VARCHAR(200),
    price DECIMAL(10, 2),
    stock_quantity INT(10),
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Flizzelbutt", "Flizzels and Pizzels", 9.99, 7), ("Shanks-A-Lot", "Toys and Games", 12.98, 10),
("Gamulules", "Seasonal", 1.99, 100), ("Pepperoni Pizzels", "Flizzels and Pizzels", 29.78, 5), ("Double D Batteries", "Adult Novelties", 14.99, 12),
("Sammimum", "Snacks", 4.99, 20), ("Flobios", "Breakfast", 3.98, 24), ("Paranthesenthetics", "Health and Beauty", 29.99, 9),
("Beer", "Beer and Wine", 15.99, 10), ("Wine", "Beer and Wine", 9.99, 18) 